import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationsService } from './notifications.service';

@WebSocketGateway()
export class NotificationsGateway {
  constructor(private readonly notificationService: NotificationsService) {}
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('joinNotifications')
  handleJoinNotifications(client: Socket, classId: string): void {
    const room = `notificationRoom-${classId}`; // Room name includes class ID
    client.join(room); // Join a specific notification room for that class ID
    this.server
      .to(room)
      .emit(
        'newUserNotification',
        `${client.id} joined notifications for class ${classId}`,
      );
  }

  @SubscribeMessage('sendNotification')
  sendNotification(
    client: Socket,
    { classId, notification }: { classId: string; notification: any },
  ): void {
    const room = `notificationRoom-${classId}`; // Room name includes class ID
    this.server
      .to(room)
      .emit('newNotification', { notification, senderId: client.id });
  }
}
