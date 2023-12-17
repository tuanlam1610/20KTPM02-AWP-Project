// src/articles/entities/article.entity.ts

import { Student } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class StudentEntity implements Student {
  @ApiProperty()
  id: string;

  @ApiProperty({ required: false })
  userId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  classMember: string[];

  @ApiProperty()
  classInvitationForStudents: string[];

  @ApiProperty()
  studentGrade: string[];

  @ApiProperty()
  gradeReview: string[];
}
