
import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';


@WebSocketGateway({path: '/back/'})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  handleConnection(client: any, ...args: any[]) {
    console.log('Client connected:', client.id);
  }


  handleDisconnect(client: any) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('msgToServer')
  handleMessage(client: any, payload: string): string {
    return 'Message received: ' + payload;
  }
}


@Module({
  providers: [ChatGateway],
})
class AppModule {}


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
