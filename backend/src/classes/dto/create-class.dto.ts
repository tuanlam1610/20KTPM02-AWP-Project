import { ApiProperty } from '@nestjs/swagger';

export class GenericIdInput {
  id: string;
}
export class CreateClassDto {
  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty()
  code: string;

  @ApiProperty({ required: false })
  invitationLink: string;

  @ApiProperty({ required: false, type: [String] })
  gradeCompositions: string[];

  @ApiProperty({ required: false, type: [String] })
  classTeachers: string[];
  @ApiProperty({ required: false, type: [String] })
  classInvitationForTeachers: string[];
  @ApiProperty({ required: false, type: [String] })
  classMembers: string[];
  @ApiProperty({ required: false, type: [String] })
  classInvitationForStudents: string[];
}
