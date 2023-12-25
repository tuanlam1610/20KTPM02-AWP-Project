// src/articles/entities/article.entity.ts

import { Teacher } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class TeacherEntity implements Teacher {
  @ApiProperty()
  id: string;

  @ApiProperty({ required: false })
  userId: string;

  @ApiProperty({ required: false })
  name: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  classTeacher: string[];

  @ApiProperty()
  classInvitationForTeacher: string[];

  @ApiProperty()
  gradeReview: string[];
}
