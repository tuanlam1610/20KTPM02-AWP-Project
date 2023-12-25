import { ApiProperty } from '@nestjs/swagger';
import { Class } from '@prisma/client';

export class ClassEntity implements Class {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  description: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  invitationLink: string;

  @ApiProperty()
  gradeComposittions: string[];

  @ApiProperty()
  classOwner: string;
  @ApiProperty()
  classOwnerId: string;

  @ApiProperty()
  classTeacher: string[];

  @ApiProperty()
  classInvitationForTeacher: string[];

  @ApiProperty()
  classMember: string[];

  @ApiProperty()
  classInvitationForStudents: string[];

  @ApiProperty()
  gradeReview: string[];
}
