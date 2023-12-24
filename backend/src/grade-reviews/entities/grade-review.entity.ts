import { ApiProperty } from '@nestjs/swagger';
import { $Enums, GradeReview } from '@prisma/client';

export class GradeReviewEntity implements GradeReview {
  @ApiProperty()
  status: $Enums.GradeReviewStatus;

  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  currentGrade: number;

  @ApiProperty()
  expectedGrade: number;

  @ApiProperty({ required: false })
  finalGrade: number;

  @ApiProperty({ required: false })
  explanation: string;

  @ApiProperty()
  comment: string[];

  @ApiProperty()
  studentId: string;

  @ApiProperty()
  teacherId: string;

  @ApiProperty()
  classId: string;

  @ApiProperty()
  studentGradeId: string;
}
