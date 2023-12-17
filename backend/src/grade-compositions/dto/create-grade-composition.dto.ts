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

  @ApiProperty({ type: [String] })
  studentGrades: string[];
}
