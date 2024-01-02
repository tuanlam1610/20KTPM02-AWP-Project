import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty()
  @IsString()
  action: string;
  @ApiProperty()
  @IsString()
  object: string;
  @ApiProperty()
  @IsString()
  objectId: string;
  @ApiProperty()
  @IsString()
  objectType: string;
  @ApiProperty()
  @IsString()
  content: string;
  @ApiProperty()
  @IsString()
  senderId: string;
  @ApiProperty()
  isRead: boolean;
  @ApiProperty()
  @IsString()
  receiverId: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}
