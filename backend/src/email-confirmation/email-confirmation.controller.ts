import {
  Controller,
  ClassSerializerInterceptor,
  UseInterceptors,
  Post,
  Body,
  UseGuards,
  Req,
  Query,
  BadRequestException,
  Get,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  InvitationEmailDto,
  ResendVerificationDto,
} from './dto/confirmEmail.dto';
import { EmailConfirmationService } from './email-confirmation.service';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { STATUS_CODES } from 'http';
import { NewPasswordDto } from 'src/auth/dto/auth.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('email-confirmation')
@ApiTags('email-confirmation')
@UseInterceptors(ClassSerializerInterceptor)
export class EmailConfirmationController {
  constructor(
    private readonly emailConfirmationService: EmailConfirmationService,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Get('confirm') //TODO CHANGE HANDLE
  @HttpCode(HttpStatus.OK)
  async confirm(@Query('token') token: string) {
    if (!token) {
      throw new BadRequestException('Token must be provided');
    }

    const email =
      await this.emailConfirmationService.decodeConfirmationToken(token);
    //TODO: This probably insecure AF
    const user = await this.emailConfirmationService.confirmEmail(email);
    const tokens = await this.authService.getTokens(user);
    await this.authService.updateRtHash(user.id, tokens.refreshToken);
    return tokens;
  }

  @Get('confirm-invite-class') //TODO CHANGE HANDLE
  @HttpCode(HttpStatus.OK)
  async confirmInviteToClassLink(@Query('token') token: string) {
    if (!token) {
      throw new BadRequestException('Token must be provided');
    }

    const { email, classId } =
      await this.emailConfirmationService.decodeConfirmationToken(token);
    //TODO: This probably insecure AF
    console.log(email, classId);
    const user = await this.emailConfirmationService.confirmInviteEmail(
      email,
      classId,
    );
  }

  @Post('confirm-password-reset')
  @HttpCode(HttpStatus.OK)
  async confirmResetPassword(
    @Query('token') token: string,
    @Body() newPasswordDto: NewPasswordDto,
  ) {
    if (!token) {
      throw new BadRequestException('Token must be provided');
    }

    const email =
      await this.emailConfirmationService.decodeConfirmationToken(token);
    //TODO: This probably insecure AF
    const user = await this.emailConfirmationService.confirmResetPasswordEmail(
      email,
      newPasswordDto.newPassword,
    );
    return STATUS_CODES.OK;
  }
  @Post('resendVerification')
  @HttpCode(HttpStatus.OK)
  async sendEmail(@Body() registrationData: ResendVerificationDto) {
    const user = this.usersService.findOneByEmail(registrationData.email);
    if (!user) throw new BadRequestException('User not found');
    await this.emailConfirmationService.sendVerificationLink(
      registrationData.email,
    );
    return STATUS_CODES.OK;
  }

  @Post('sendInviteEmail')
  @HttpCode(HttpStatus.OK)
  async sendInviteEmail(@Body() registrationData: InvitationEmailDto) {
    const user = this.usersService.findOneByEmail(registrationData.email);
    if (!user) throw new BadRequestException('User not found');
    await this.emailConfirmationService.sendInviteLink(
      registrationData.email,
      registrationData.classId,
    );
    return STATUS_CODES.OK;
  }
}
