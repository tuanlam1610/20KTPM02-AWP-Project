import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateGradeReviewDto } from './create-grade-review.dto';
import { GradeReviewStatus } from '@prisma/client';

export class UpdateGradeReviewDto extends PartialType(CreateGradeReviewDto) {}

export class FinalizeGradeReviewDto {
  @ApiProperty()
  teacherId: string;
  @ApiProperty()
  finalGrade: number;
  @ApiProperty()
  status: GradeReviewStatus;
}
