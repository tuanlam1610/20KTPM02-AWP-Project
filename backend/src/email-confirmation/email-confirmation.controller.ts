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
} from '@nestjs/common';
import { ResendVerificationDto } from './dto/confirmEmail.dto';
import { EmailConfirmationService } from './email-confirmation.service';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { STATUS_CODES } from 'http';
import { NewPasswordDto } from 'src/auth/dto/auth.dto';

@Controller('email-confirmation')
@UseInterceptors(ClassSerializerInterceptor)
export class EmailConfirmationController {
  constructor(
    private readonly emailConfirmationService: EmailConfirmationService,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Get('confirm') //TODO CHANGE HANDLE
  async confirm(@Query('token') token: string) {
    if (!token) {
      throw new BadRequestException('Token must be provided');
    }

    const email =
      await this.emailConfirmationService.decodeConfirmationToken(token);
    //TODO: This probably insecure AF
    const user = await this.emailConfirmationService.confirmEmail(email);
    const tokens = await this.authService.getTokens(user.id, user.email);
    await this.authService.updateRtHash(user.id, tokens.refreshToken);
    return tokens;
  }
  @Post('confirm-password-reset')
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
  async sendEmail(@Body() registrationData: ResendVerificationDto) {
    const user = this.usersService.findOneByEmail(registrationData.email);
    if (!user) throw new BadRequestException('User not found');
    await this.emailConfirmationService.sendVerificationLink(
      registrationData.email,
    );
    return STATUS_CODES.OK;
  }
}
