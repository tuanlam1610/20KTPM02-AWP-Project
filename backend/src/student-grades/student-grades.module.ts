import { Module } from '@nestjs/common';
import { StudentGradesService } from './student-grades.service';
import { StudentGradesController } from './student-grades.controller';
import { PrismaClient } from '@prisma/client';

@Module({
  imports: [PrismaClient],
  controllers: [StudentGradesController],
  providers: [StudentGradesService],
  exports: [StudentGradesService],
})
export class StudentGradesModule {}
