import { Module } from '@nestjs/common';
import { GradeCompositionsService } from './grade-compositions.service';
import { GradeCompositionsController } from './grade-compositions.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { StudentGradesModule } from 'src/student-grades/student-grades.module';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [PrismaModule, StudentGradesModule, NotificationsModule],
  controllers: [GradeCompositionsController],
  providers: [GradeCompositionsService],
  exports: [GradeCompositionsService],
})
export class GradeCompositionsModule {}
