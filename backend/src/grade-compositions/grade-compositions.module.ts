import { Module } from '@nestjs/common';
import { GradeCompositionsService } from './grade-compositions.service';
import { GradeCompositionsController } from './grade-compositions.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { StudentGradesModule } from 'src/student-grades/student-grades.module';

@Module({
  imports: [PrismaModule, StudentGradesModule],
  controllers: [GradeCompositionsController],
  providers: [GradeCompositionsService],
  exports: [GradeCompositionsService],
})
export class GradeCompositionsModule {}
