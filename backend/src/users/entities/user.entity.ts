// src/articles/entities/article.entity.ts

import { User } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UserEntity implements User {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ required: false })
  name: string;

  @ApiProperty({ required: false })
  dob: Date;

  @ApiProperty()
  hash: string;

  @ApiProperty({ required: false })
  hashedRt: string;

  @ApiProperty()
  roles: string[];

  @ApiProperty({ required: false })
  studentId?: string;
  @ApiProperty({ required: false })
  teacherId?: string;
  @ApiProperty({ required: false })
  adminId?: string;

  @ApiProperty()
  comment?: string[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  isEmailConfirm: boolean = false;

  @ApiProperty()
  isLocked: boolean = false;

  @ApiProperty()
  isBanned: boolean = false;
}
