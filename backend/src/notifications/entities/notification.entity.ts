import { ApiProperty } from '@nestjs/swagger';
import { Notification } from '@prisma/client';
export class NotificationEntity implements Notification {
  @ApiProperty()
  id: string;
  @ApiProperty()
  action: string;
  @ApiProperty()
  object: string;
  @ApiProperty()
  objectId: string;
  @ApiProperty()
  objectType: string;
  @ApiProperty()
  content: string;
  @ApiProperty()
  senderId: string;
  @ApiProperty()
  isRead: boolean;
  @ApiProperty()
  receiverId: string;
  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
