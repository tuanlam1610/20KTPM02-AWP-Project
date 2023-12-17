import { ApiProperty } from '@nestjs/swagger';
import { GradeComposition } from '@prisma/client';

export class GradeCompositionEntity implements GradeComposition {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  name: string;

  @ApiProperty()
  percentage: number;

  @ApiProperty()
  rank: number;

  @ApiProperty()
  isFinalized: boolean;

  @ApiProperty()
  classId: string;

  @ApiProperty()
  StudentGrades: string[];
}
