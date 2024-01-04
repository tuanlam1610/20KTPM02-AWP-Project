import { OnModuleInit } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class AppGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  private readonly classRooms = new Map<string, string[]>(); // Map to track users in class rooms
  private readonly commentRooms = new Map<string, string[]>(); // Map to track users in comment rooms

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id, 'Connected');
      socket.on('disconnect', () => {
        console.log(socket.id, 'Disconnected');

        // Remove the disconnected user from all rooms
        this.removeFromAllRooms(socket.id);
      });
    });
  }
  private removeFromAllRooms(socketId: string) {
    this.classRooms.forEach((users, roomId) => {
      const index = users.indexOf(socketId);
      if (index !== -1) {
        users.splice(index, 1);
        this.classRooms.set(roomId, users);
      }
    });

    this.commentRooms.forEach((users, roomId) => {
      const index = users.indexOf(socketId);
      if (index !== -1) {
        users.splice(index, 1);
        this.commentRooms.set(roomId, users);
      }
    });
  }

  @SubscribeMessage('joinClassNotifications')
  onClassNotificationsJoin(
    @MessageBody() body: any,
    @ConnectedSocket() client: Socket,
  ) {
    const { classId, userId } = body;
    console.log(classId, userId);
    client.join(`classRoom-${classId}`); // Join a specific class room
    this.addToRoom(this.classRooms, `classRoom-${classId}`, userId);
  }

  @SubscribeMessage('joinCommentRoom')
  onCommentRoomJoin(
    @MessageBody() body: any,
    @ConnectedSocket() client: Socket,
  ) {
    const { commentId, userId } = body;
    client.join(`commentRoom-${commentId}`); // Join a specific comment room
    this.addToRoom(this.commentRooms, `commentRoom-${commentId}`, userId);
  }

  private addToRoom(
    roomMap: Map<string, string[]>,
    roomId: string,
    userId: string,
  ) {
    const users = roomMap.get(roomId) || [];
    users.push(userId);
    roomMap.set(roomId, users);
    console.log(roomMap);
  }

  private removeFromRoom(
    roomMap: Map<string, string[]>,
    roomId: string,
    userId: string,
  ) {
    const users = roomMap.get(roomId) || [];
    const index = users.indexOf(userId);
    if (index !== -1) {
      users.splice(index, 1);
      roomMap.set(roomId, users);
    }
  }

  getOnlineUsers(roomId: string): string[] {
    return this.classRooms.get(roomId) || [];
  }

  emitNotification(roomId: string, notification: any) {
    console.log(roomId, notification.action);
    this.server.to(roomId).emit(notification.action, notification);
  }
}
//TODO handle case where client go offline
