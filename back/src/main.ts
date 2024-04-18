
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
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: any) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('/join')
  async handleEvent(@MessageBody() data: interfaces.Channel) {
    const knex = this.knex
    const keydb = this.keydb

    const load_db_into_keydb = async (table_name, stream_name) => {
      await knex
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
          await knex.insert([{author: data.user, message: `User: "${data.user}" has created ${data.channel}!`}]).into(table_name)
        }

        // Does the stream exist?
        // Load the table's rows into the stream does not yet exist
        const stream_exists: boolean = !!(await keydb.exists(stream_name))
        if (!stream_exists) load_db_into_keydb(table_name, stream_name)

        // if the stream does exist, some other user already loaded it
      })

    }
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
