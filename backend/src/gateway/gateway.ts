import { OnModuleInit } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CommentEntity } from 'src/comments/entities/comment.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class AppGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  private readonly socketToUserMapping = new Map<string, string>(); // Map to track users and their socket IDs
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
    console.log(socketId);
    this.classRooms.forEach((users, roomId) => {
      console.log(roomId, socketId);
      //delete from usersSocketMapping
      const index = users.indexOf(this.socketToUserMapping.get(socketId));
      console.log(index);
      console.log(users);
      if (index !== -1) {
        users.splice(index, 1);
        this.classRooms.set(roomId, users);
      }
    });

    this.commentRooms.forEach((users, roomId) => {
      const index = users.indexOf(this.socketToUserMapping.get(socketId));
      if (index !== -1) {
        users.splice(index, 1);
        this.commentRooms.set(roomId, users);
      }
    });
    this.socketToUserMapping.delete(socketId);
  }

  @SubscribeMessage('joinClassNotifications')
  onClassNotificationsJoin(
    @MessageBody() body: any,
    @ConnectedSocket() client: Socket,
  ) {
    const { classId, userId } = body;
    console.log(classId, userId);
    client.join(`classRoom-${classId}`); // Join a specific class room
    this.addToRoom(this.classRooms, `classRoom-${classId}`, userId, client.id);
  }

  @SubscribeMessage('joinCommentRoom')
  onCommentRoomJoin(
    @MessageBody() body: any,
    @ConnectedSocket() client: Socket,
  ) {
    const { gradeReviewId, userId } = body;
    client.join(`commentRoom-${gradeReviewId}`); // Join a specific comment room
    this.addToRoom(
      this.commentRooms,
      `commentRoom-${gradeReviewId}`,
      userId,
      client.id,
    );
  }

  @SubscribeMessage('joinAsTeacher')
  onTeacherJoin(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
    const { classId, userId } = body;
    this.socketToUserMapping.set(client.id, userId);
    console.log(this.socketToUserMapping);
  }

  private addToRoom(
    roomMap: Map<string, string[]>,
    roomId: string,
    userId: string,
    socketId: string,
  ) {
    //map UserId to SocketId
    this.socketToUserMapping.set(socketId, userId);
    const users = roomMap.get(roomId) || [];
    users.push(userId);
    roomMap.set(roomId, users);
    console.log(roomMap);
  }

  // private removeFromRoom(
  //   roomMap: Map<string, string[]>,
  //   roomId: string,
  //   userId: string,
  // ) {
  //   //delete from usersSocketMapping
  //   this.usersSocketMapping.delete(userId);
  //   const users = roomMap.get(roomId) || [];
  //   const index = users.indexOf(userId);
  //   if (index !== -1) {
  //     users.splice(index, 1);
  //     roomMap.set(roomId, users);
  //   }
  // }

  getOnlineUsers(roomId: string): string[] {
    return this.classRooms.get(roomId) || [];
  }

  emitNotification(roomId: string, notification: any) {
    console.log(roomId, notification.action);
    this.server.to(roomId).emit(notification.action, notification);
  }

  sendNotificationToUser(userId: string, notification: any) {
    console.log(this.socketToUserMapping);
    console.log(Array.from(this.socketToUserMapping.keys())); // Display keys

    const socketKey = Array.from(this.socketToUserMapping.keys()).find(
      (key) => {
        console.log(this.socketToUserMapping.get(key), userId);
        return this.socketToUserMapping.get(key) === userId;
      },
    );

    console.log(socketKey);

    if (socketKey) {
      console.log(socketKey, notification.action, notification);
      this.server.to(socketKey).emit(notification.action, notification);
    }
  }
  emitCommentAndNotificationToRoom(
    gradeReviewId: string,
    notification: any,
    comment: CommentEntity,
  ) {
    console.log(gradeReviewId, notification.action);
    this.server
      .to(`commentRoom-${gradeReviewId}`)
      .emit(notification.action, { notification, comment });
  }

  findKeyByValue(map, value) {
    for (let [key, val] of map.entries()) {
      if (val === value) {
        return key;
      }
    }
    return undefined; // Return undefined if value is not found
  }
}
//TODO handle comment joining and leaving
