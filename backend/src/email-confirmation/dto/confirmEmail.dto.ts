import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class ConfirmEmailDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}

export default ConfirmEmailDto;

export class ResendVerificationDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class InvitationEmailDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  classId: string;
}
