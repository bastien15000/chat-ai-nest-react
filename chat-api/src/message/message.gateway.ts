import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import fs from 'fs';
import OpenAI from 'openai';
const openai = new OpenAI({
  apiKey: "TEST"
})

@WebSocketGateway({ cors: true })
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private clients: { client: Socket; username: string }[] = [];

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any): string {
    console.log({ payload });
    this.server.emit('message', payload);
    return 'Hello world!';
  }

  @SubscribeMessage('user-take')
  handleUserTake(client: Socket, payload: any): void {
    const index = this.clients.findIndex(
      ({ client: _client }) => _client.id === client.id,
    );

    this.clients.splice(index, 1, { client, username: payload });
  }

  @SubscribeMessage('user-check')
  handleUserCheck(client: Socket, payload: any): void {
    client.emit(
      'user-exist',
      this.clients.some(({ username: u }) => u === payload),
    );
  }

  @SubscribeMessage('transcription')
  async handleTranscription(client: Socket, payload: any): Promise<void> {
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(payload),
      model: "whisper-1"
    })
    client.emit("transcription", transcription)
  }

  handleConnection(client: any, ...args: any[]) {
    this.clients.push({ client, username: '' });
    console.log({ id: client.id });
  }
  handleDisconnect(client: any) {
    this.clients = this.clients.filter(
      ({ client: _client }) => _client.id !== client.id,
    );
    console.log({ disconnectid: client.id });
  }
}
