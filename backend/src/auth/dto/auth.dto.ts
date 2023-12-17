import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password: string;
}

export class SocialLoginDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  idToken: string;
}

export class SignUpDto extends AuthDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsDateString()
  dob: Date;
}

export class AccountToResetPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
export class ResetPasswordDto extends AccountToResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  newPassword: string;
}

export class NewPasswordDto {
  @IsNotEmpty()
  @IsString()
  newPassword: string;
}
