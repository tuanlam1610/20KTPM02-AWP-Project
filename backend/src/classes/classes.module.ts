import { Module } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { ClassesController } from './classes.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GradeCompositionsModule } from 'src/grade-compositions/grade-compositions.module';

@Module({
  imports: [PrismaModule, GradeCompositionsModule],
  controllers: [ClassesController],
  providers: [ClassesService],
  exports: [ClassesService],
})
export class ClassesModule {}
