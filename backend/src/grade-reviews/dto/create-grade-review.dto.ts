import { ApiProperty } from '@nestjs/swagger';

export class CreateGradeReviewDto {
  @ApiProperty()
  currentGrade: number;

  @ApiProperty()
  expectedGrade: number;

  @ApiProperty({ required: false })
  finalGrade?: number;

  @ApiProperty({ required: false })
  explanation: string;

  @ApiProperty()
  comment: string[];

  @ApiProperty()
  studentId: string;

  @ApiProperty()
  teacherId: string;

  @ApiProperty()
  studentGradeId: string;
}
