import { ApiProperty } from '@nestjs/swagger';

export class CreateStudentGradeDto {
  @ApiProperty()
  grade: number;
  @ApiProperty()
  gradeCompositionId: string;
  @ApiProperty()
  studentId: string;
  @ApiProperty({ required: false })
  gradeReviewId: string;
}
