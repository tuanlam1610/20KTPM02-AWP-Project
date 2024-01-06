import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppGateway } from 'src/gateway/gateway';
import { CommentEntity } from 'src/comments/entities/comment.entity';

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    private appGateway: AppGateway,
  ) {}

  findUnreadNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: {
        receiverId: userId,
        isRead: false,
      },
    });
  }

  markUnreadNotificationsAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: {
        receiverId: userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
  }

  async createAndSendNotifications(notifications: any[], classId: string) {
    const createdNotifications = await this.saveNotifications(notifications);
    //This only apply to  finalized GC
    await this.sendNotificationsToClassMembers(createdNotifications, classId);
    return createdNotifications;
  }

  async createAndSendOneNotification(notification: any, userId: string) {
    const createdNotifications = await this.saveNotifications([notification]);
    //This only apply to  finalized GC
    await this.sendNotificationToUser(notification, userId);
    return createdNotifications;
  }

  async handleCommentAndNotification(notifcation: any, comment: CommentEntity) {
    const createdNotifications = await this.saveNotifications([notifcation]);
    //This only apply to  finalized GC
    await this.emitCommentAndNotificationToRoom(
      notifcation,
      comment.gradeReviewId,
      comment,
    );
    return createdNotifications;
  }

  private async saveNotifications(notifications: any[]) {
    console.log('saving notifications');
    // Save notifications in the database using Prisma
    const createdNotifications = await Promise.all(
      notifications.map(async (notification) => {
        return await this.prisma.notification.create({
          data: notification,
        });
      }),
    );

    return createdNotifications;
  }
  private async sendNotificationsToGRRoom(
    notifications: any[],
    gradeReviewId: string,
  ) {
    console.log('sending notifications');
    const roomId = `commentRoom-${gradeReviewId}`; // `classRoom-${classId}
    const onlineUsers = this.appGateway.getOnlineUsers(
      `commentRoom-${gradeReviewId}`,
    ); // Get a list of online users
    for (const notification of notifications) {
      if (onlineUsers.includes(notification.receiverId)) {
        // If the receiver is online, emit the notification
        console.log('emitting notification');
        await this.appGateway.emitNotification(roomId, notification);
      }
    }
  }

  private async sendNotificationsToClassMembers(
    notifications: any[],
    classId: string,
  ) {
    console.log('sending notifications');
    const roomId = `classRoom-${classId}`; // `classRoom-${classId}
    const onlineUsers = this.appGateway.getOnlineUsers(`classRoom-${classId}`); // Get a list of online users
    for (const notification of notifications) {
      if (onlineUsers.includes(notification.receiverId)) {
        // If the receiver is online, emit the notification
        console.log('emitting notification');
        await this.appGateway.sendNotificationToUser(
          notification.receiverId,
          notification,
        );
      }
    }
  }
  private async sendNotificationToUser(notification: any, userId: string) {
    this.appGateway.sendNotificationToUser(userId, notification);
  }

  private async emitCommentAndNotificationToRoom(
    notification: any,
    gradeReviewId: string,
    comment: CommentEntity,
  ) {
    this.appGateway.emitCommentAndNotificationToRoom(
      gradeReviewId,
      notification,
      comment,
    );
  }

  create(createNotificationDto: CreateNotificationDto) {
    return this.prisma.notification.create({
      data: createNotificationDto,
    });
  }

  findAll() {
    return this.prisma.notification.findMany();
  }

  findOne(id: string) {
    return this.prisma.notification.findUnique({
      where: { id },
    });
  }

  update(id: string, updateNotificationDto: UpdateNotificationDto) {
    return this.prisma.notification.update({
      where: { id },
      data: updateNotificationDto,
    });
  }

  remove(id: string) {
    return this.prisma.notification.delete({
      where: { id },
    });
  }
}
