import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import EmailService from '../emails/emails.service';
import { UsersService } from '../users/users.service';
import VerificationTokenPayload from 'src/emails/interface/verificationTokenPayload.interface';
import { UserEntity } from 'src/users/entities/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { STATUS_CODES } from 'http';

@Injectable()
export class EmailConfirmationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  public sendVerificationLink(email: string) {
    const payload: VerificationTokenPayload = { email };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      expiresIn: '5m',
    });

    const url = `${this.configService.get(
      'EMAIL_CONFIRMATION_URL',
    )}?token=${token}`;

    const text = `Welcome to the application. To confirm the email address, click here: ${url}`;

    return this.emailService.sendMail({
      to: email,
      subject: 'Email confirmation',
      text,
    });
  }

  public sendResetPasswordLink(email: string) {
    const payload: VerificationTokenPayload = { email };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      expiresIn: '5m',
    });

    const url = `${this.configService.get(
      'EMAIL_RESET_PASSWORD_URL',
    )}?token=${token}`;

    const text = `Welcome to the application. Click here to reset password: ${url}`;

    return this.emailService.sendMail({
      to: email,
      subject: 'Reset your password',
      text,
    });
  }

  public async confirmEmail(email: string): Promise<UserEntity> {
    const user = await this.usersService.findOneByEmail(email);
    if (user.isEmailConfirm) {
      throw new BadRequestException('Email already confirmed');
    }
    return await this.usersService.markEmailConfirmed(email);
  }

  public async confirmResetPasswordEmail(
    email: string,
    newPassword: string,
  ): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException('Email not found');
    }
    await this.authService.resetPassword({ email, newPassword });
    //Todo: LM-24 let user redirect to password reset page
    return STATUS_CODES.OK;
  }

  public async decodeConfirmationToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      });

      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }

  // ...
}
