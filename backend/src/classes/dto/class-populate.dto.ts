import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, ArrayNotEmpty } from 'class-validator';

export class StudentDataDto {
  @IsString()
  name: string;

  @IsUUID()
  studentId: string;
}

export class PopulateClassDto {
  @ApiProperty()
  @ArrayNotEmpty()
  students: StudentDataDto[];
}
