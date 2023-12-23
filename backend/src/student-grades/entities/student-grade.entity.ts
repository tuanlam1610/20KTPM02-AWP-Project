import { ApiProperty } from '@nestjs/swagger';
import { StudentGrade } from '@prisma/client';

export class StudentGradeEntity implements StudentGrade {
  @ApiProperty()
  id: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty()
  gradeCompositionId: string;
  @ApiProperty()
  studentId: string;
  @ApiProperty()
  gradeReviewId: string;
  @ApiProperty()
  grade: number;
}
