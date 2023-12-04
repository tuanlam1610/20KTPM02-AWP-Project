import { IsDateString, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class SocialLoginDto {
  @IsNotEmpty()
  @IsString()
  idToken: string;
}

export class SignUpDto extends AuthDto {
  @IsString()
  name: string;

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
