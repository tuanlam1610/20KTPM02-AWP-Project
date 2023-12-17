import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateTeacherDto {
  // @ApiProperty({ required: false })
  // @IsString()
  // id?: string;

  @ApiProperty({ required: false })
  @IsString()
  userId?: string;

  @ApiProperty({ required: false })
  @IsString({ each: true })
  @IsOptional()
  classTeacher?: string[]; // Assuming these are IDs represented as strings

  @ApiProperty({ required: false })
  @IsString({ each: true })
  @IsOptional()
  classInvitationForTeacher?: string[]; // Assuming these are IDs represented as strings

  @ApiProperty({ required: false })
  @IsString({ each: true })
  @IsOptional()
  gradeReview?: string[]; // Assuming these are IDs represented as strings
}
