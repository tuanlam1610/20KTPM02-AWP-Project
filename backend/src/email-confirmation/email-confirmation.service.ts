import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import EmailService from '../emails/emails.service';
import { UsersService } from '../users/users.service';
import VerificationTokenPayload, {
  VerificationTokenInvitePayload,
} from 'src/emails/interface/verificationTokenPayload.interface';
import { UserEntity } from 'src/users/entities/user.entity';
import { STATUS_CODES } from 'http';
import { ClassesService } from 'src/classes/classes.service';
import { AuthService } from 'src/auth/auth.service';
import { ClassEntity } from 'src/classes/entities/class.entity';

@Injectable()
export class EmailConfirmationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly classesService: ClassesService,
  ) {}

  public sendVerificationLink(email: string) {
    const payload: VerificationTokenPayload = { email };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      expiresIn: '30d',
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

  public async sendInviteLink(email: string, classId: string) {
    const payload: VerificationTokenInvitePayload = {
      email,
      classId: classId,
    };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      expiresIn: '7d',
    });

    const url = `${this.configService.get('EMAIL_INVITE_URL')}?token=${token}`;

    const text = `The class welcome you to join everyone, to keep up to date with your subject. \n
    Click here to join:  ${url}`;

    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException('email for user not found');
    }
    this.classesService.inviteUserToClass(classId, user.id);

    return this.emailService.sendMail({
      to: email,
      subject: `[Invite] Invitation to join class ${classId}`,
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

  public async confirmInviteEmail(
    email: string,
    classId: string,
  ): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException('Email not found');
    }
    if (user.roles.includes('student')) {
      await this.classesService.addStudentToClass(classId, user.id);
    } else {
      await this.classesService.addTeacherToClass(classId, user.id);
    }

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
