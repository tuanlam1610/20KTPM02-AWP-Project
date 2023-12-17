import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty()
  gradeReviewId: string;
  @ApiProperty()
  userId: string;
  @ApiProperty()
  content: string;
}
