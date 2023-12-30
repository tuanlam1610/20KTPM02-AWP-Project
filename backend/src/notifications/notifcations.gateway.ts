import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets';
import { Socket } from 'dgram';
import { Observable, from, map } from 'rxjs';

@WebSocketGateway(80, { namespace: 'notifications' })
export class NotificationsGateway {
  @SubscribeMessage('notifcations')
  handleNotifcations(@MessageBody() data: string): string {
    return data;
  }

  @SubscribeMessage('notificationsId')
  handleNotificationsId(@MessageBody('id') id: number): number {
    // id === messageBody.id
    return id;
  }

  @SubscribeMessage('events')
  handleEvent(client: Socket, data: string): string {
    return data;
  }

  @SubscribeMessage('events')
  handleReply(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ): string {
    return data; //ignore
  }

  //socket client
  //   socket.emit('events', { name: 'Nest' }, (data) => console.log(data));

  @SubscribeMessage('events')
  handleMultiEvent(@MessageBody() data: unknown): WsResponse<unknown> {
    const event = 'events';
    return { event, data };
  }

  @SubscribeMessage('events')
  onEvent(@MessageBody() data: unknown): Observable<WsResponse<number>> {
    const event = 'events';
    const response = [1, 2, 3];

    return from(response).pipe(map((data) => ({ event, data })));
  }
}

// OnGatewayInit	Forces to implement the afterInit() method. Takes library-specific server instance as an argument (and spreads the rest if required).
// OnGatewayConnection	Forces to implement the handleConnection() method. Takes library-specific client socket instance as an argument.
// OnGatewayDisconnect	Forces to implement the handleDisconnect() method. Takes library-specific client socket instance as an argument.

@WebSocketServer()
server: Server;
