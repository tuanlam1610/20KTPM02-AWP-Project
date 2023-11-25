// src/articles/entities/article.entity.ts

import { User } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UserEntity implements User {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty({ required: false })
  name: string;

  @ApiProperty({ required: false })
  dob: Date;

  @ApiProperty()
  hash: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  hashedRt: string;

  @ApiProperty()
  isEmailConfirmed: boolean;
}
