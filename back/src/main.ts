
import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';

import { SubscribeMessage, MessageBody, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';

import { Knex } from 'knex';
import { KnexModule, InjectConnection  } from 'nest-knexjs';

import * as interfaces from '@/interfaces'


@WebSocketGateway({path: '/back/'})
class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(@InjectConnection() protected readonly knex: Knex) {}

  handleConnection(client: any, ...args: any[]) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: any) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('/join')
  async handleEvent(@MessageBody() data: interfaces.Channel) {
    const knex = this.knex
    if (data.channel) {
      await knex.schema.hasTable(data.channel).then(async function(exists) {
        if (!exists) {
          return knex.schema.createTable(data.channel, function(t) {
            t.increments();
            t.string('author');
            t.string('message');
          })
        }
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
  ],
  providers: [ChatGateway],
})
class AppModule {}


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
