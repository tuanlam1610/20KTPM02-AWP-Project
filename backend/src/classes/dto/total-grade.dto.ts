import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class TotalGradeDto {
  @ApiProperty()
  @IsString()
  studentId: string;
  @ApiProperty()
  @IsNumber()
  totalGrade: number;
}
