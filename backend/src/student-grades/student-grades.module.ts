import { Module } from '@nestjs/common';
import { StudentGradesService } from './student-grades.service';
import { StudentGradesController } from './student-grades.controller';

@Module({
  controllers: [StudentGradesController],
  providers: [StudentGradesService],
})
export class StudentGradesModule {}
