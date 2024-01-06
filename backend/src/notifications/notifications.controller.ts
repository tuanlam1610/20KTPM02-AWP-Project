import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller('notifications')
@ApiTags('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('/user/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: CreateNotificationDto })
  getUserNotifications(@Param('userId') userId: string) {
    return this.notificationsService.getUserNotifications(userId);
  }

  @Get('unread/user/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: CreateNotificationDto })
  findUnreadNotifications(@Param('userId') userId: string) {
    return this.notificationsService.findUnreadNotifications(userId);
  }

  @Patch('unread/user/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: CreateNotificationDto })
  markUnreadNotifications(@Param('userId') userId: string) {
    return this.notificationsService.markUnreadNotificationsAsRead(userId);
  }

  @Post()
  @ApiCreatedResponse()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  @ApiOkResponse({ type: CreateNotificationDto })
  findAll() {
    return this.notificationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationsService.update(id, updateNotificationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(id);
  }
}
