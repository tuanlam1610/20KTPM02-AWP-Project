import { Module } from '@nestjs/common';
import { GradeReviewsService } from './grade-reviews.service';
import { GradeReviewsController } from './grade-reviews.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [PrismaModule, NotificationsModule],
  controllers: [GradeReviewsController],
  providers: [GradeReviewsService],
  exports: [GradeReviewsService],
})
export class GradeReviewsModule {}
