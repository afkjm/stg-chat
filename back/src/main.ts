import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';


// https://docs.nestjs.com/websockets/adapter#ws-library


// @WebSocketGateway({ path: '/back/' })
@WebSocketGateway()
export class ChatGateway {
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'chatgateway??';
  }
}

@Module({
  imports: [],
  providers: [ChatGateway],
})
export class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.enableCors({
  //   origin: true,
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  //   credentials: true,
  // });
  // app.enableCors();
  await app.listen(3000);
}
bootstrap();
