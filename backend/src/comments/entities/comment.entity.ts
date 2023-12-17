import { ApiProperty } from '@nestjs/swagger';
import { Comment } from '@prisma/client';
export class CommentEntity implements Comment {
  @ApiProperty()
  id: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty()
  gradeReviewId: string;
  @ApiProperty()
  userId: string;
  @ApiProperty()
  content: string;
}
