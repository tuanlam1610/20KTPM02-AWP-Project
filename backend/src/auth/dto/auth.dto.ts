import { IsDateString, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class SignUpDto extends AuthDto {
  @IsString()
  name: string;

  @IsDateString()
  dob: Date;
}
