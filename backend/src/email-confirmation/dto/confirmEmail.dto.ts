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
