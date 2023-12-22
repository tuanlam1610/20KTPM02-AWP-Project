import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateStudentDto {
  @ApiProperty({ required: false })
  userId?: string;

  @ApiProperty({ required: false })
  @IsString({ each: true })
  @IsOptional()
  classMember?: string[]; // Assuming these are IDs represented as strings

  @ApiProperty({ required: false })
  @IsString({ each: true })
  @IsOptional()
  classInvitationForStudent?: string[]; // Assuming these are IDs represented as strings

  @ApiProperty({ required: false })
  @IsString({ each: true })
  @IsOptional()
  studentGrade?: string[]; // Assuming these are IDs represented as strings

  @ApiProperty({ required: false })
  @IsString({ each: true })
  @IsOptional()
  gradeReview?: string[]; // Assuming these are IDs represented as strings
}
