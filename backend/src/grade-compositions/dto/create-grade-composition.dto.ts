import { ApiProperty } from '@nestjs/swagger';

export class CreateGradeCompositionDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  percentage: number;

  @ApiProperty()
  rank: number;

  @ApiProperty({ required: false })
  isFinalized: boolean;

  @ApiProperty()
  classId: string;

  //TODO chjange students grade from array of strings to array of Map id To Grade {id: , grade:}
  @ApiProperty({ type: [String] })
  studentGrades: string[];
}
