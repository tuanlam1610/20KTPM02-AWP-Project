import { ApiProperty } from '@nestjs/swagger';
import { GradeReviewStatus } from '@prisma/client';

export class CreateGradeReviewDto {
  @ApiProperty()
  currentGrade: number;

  @ApiProperty()
  expectedGrade: number;

  @ApiProperty({ required: false })
  status?: GradeReviewStatus;

  @ApiProperty({ required: false })
  finalGrade?: number;

  @ApiProperty({ required: false })
  explanation?: string;

  @ApiProperty()
  comment: string[];

  @ApiProperty()
  studentId: string;

  @ApiProperty()
  teacherId: string;

  @ApiProperty()
  studentGradeId: string;

  @ApiProperty()
  classId: string;
}
