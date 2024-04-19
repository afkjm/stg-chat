
import { NestFactory } from '@nestjs/core';
import { Module, Inject } from '@nestjs/common';

import { RedisModule, InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';

import { SubscribeMessage, MessageBody, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';

import { Knex } from 'knex'
import { KnexModule, InjectConnection  } from 'nest-knexjs';

import * as interfaces from '@/interfaces'


@WebSocketGateway({path: '/back/'})
class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @InjectConnection() protected readonly knex: Knex,
    @InjectRedis() private readonly keydb: Redis,
  ) {}

  handleConnection(client: any, ...args: any[]) {
    // console.log('Client connected:', client.id);
  }

  handleDisconnect(client: any) {
    // console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('/say')
  async handleSay(client: any, data: any) {
    const knex = this.knex
    const keydb = this.keydb

    // get the "room" (channel) that the user has joined
    // the socket.io "default" room is always present, so just find the
    // first room that is not the default room (identified by the `client.id`)
    const client_room: string =
      [...client.rooms].filter(room => client.id !== room)[0]

    // persist the message to the database in the appropriate channel table

    await knex.insert([{...data}]).into(client_room)

    // xadd the message to the channel stream
    const stream_name = `${client_room}--stream`
    await keydb.xadd(stream_name, '*', data.author, data.message)

    // let other clients connected to the room know what was said

    await client.server.to(client_room).emit('message', data)
  }

  @SubscribeMessage('/join')
  async handleJoin(client: any, data: interfaces.Channel) {
    const knex = this.knex
    const keydb = this.keydb

    const load_db_into_keydb = async (table_name, stream_name) => {
      return await knex
        .select<interfaces.ChannelRecords>('*')
        .from(table_name)
        .then(async rows => {
          for (let row of rows) {
            await keydb.xadd(stream_name, '*', row.author, row.message)
          }
        })
    }

    if (data.channel) {

      const table_name: string = data.channel
      const stream_name = `${table_name}--stream`

      await knex.schema.hasTable(table_name).then(async function(table_exists) {
        if (!table_exists) {
          await knex.schema.createTable(table_name, function(t) {
            t.increments();
            t.string('author');
            t.string('message');
          })
          await knex.insert([{
            author: data.user,
            message: `Welcome to ${data.channel}, created by ${data.user}`,
          }]).into(table_name)
        }

        // Does the stream exist?
        // Load the table's rows into the stream does not yet exist
        const stream_exists: boolean = !!(await keydb.exists(stream_name))
        if (!stream_exists) await load_db_into_keydb(table_name, stream_name)

        // if the stream does exist, some other user already loaded it
      })

      // Join just one room
      // https://github.com/socketio/socket.io/discussions/4905
      client.rooms.forEach(room=>{
        if (room !== client.id) {
          client.leave(room)
        }
      })
      client.join(data.channel)

      // https://stackoverflow.com/questions/18093638/socket-io-rooms-get-list-of-clients-in-specific-room
      const n_users: number = client.server.sockets.adapter.rooms.get(data.channel).size

      // we pass back any existing messages
      // (configurable up to n messages via `COUNT` below)
      const messages = (await keydb.xrange(stream_name, '-', '+')).map(x => x[1])
      return {
        response: 'success',
        data: {
          channel: table_name,
          messages: messages,
          n_users: n_users,
        },
      }
    }
  }

  @SubscribeMessage('/delete_channel')
  async handleDeleteChannel(client: any, data: any) {
    const knex = this.knex
    const keydb = this.keydb
    await knex.schema.dropTableIfExists(data.channel);
    await keydb.del(`${data.channel}--stream`)
  }
}


@Module({
  imports: [
    KnexModule.forRootAsync({
      useFactory: () => ({
        config: {
          client: 'pg',
          version: '16.2',
          connection: {
            host: 'postgres',
            user: 'stg',
            password: 'demonstration',
            database: 'stg',
          },
        },
      }),
    }),
    RedisModule.forRoot({
      type: 'single',
      url: 'redis://keydb:6379',
    }),
  ],
  providers: [ChatGateway],
})
class AppModule {}


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
