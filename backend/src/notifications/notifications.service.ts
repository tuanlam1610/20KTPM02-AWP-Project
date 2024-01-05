import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppGateway } from 'src/gateway/gateway';

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    private appGateway: AppGateway,
  ) {}

  async createAndSendNotifications(notifications: any[], classId: string) {
    const createdNotifications = await this.saveNotifications(notifications);
    //This only apply to  finalized GC
    await this.sendNotificationsToOnlineUsers(createdNotifications, classId);
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

  private async sendNotificationsToOnlineUsers(
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
        await this.appGateway.emitNotification(roomId, notification);
      }
    }
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
