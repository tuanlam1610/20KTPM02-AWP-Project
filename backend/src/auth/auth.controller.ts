import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AccountToResetPasswordDto,
  AuthDto,
  ResetPasswordDto,
  SignUpDto,
} from './dto/auth.dto';
import { Tokens } from './types';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GetCurrentUser, GetCurrentUserId } from './common/decorators';
import { EmailConfirmationService } from 'src/email-confirmation/email-confirmation.service';
import { STATUS_CODES } from 'http';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  // @Post('register')
  // async register(@Body() registrationData: RegisterDto) {
  //   const user = await this.authenticationService.register(registrationData);
  //   await this.emailConfirmationService.sendVerificationLink(registrationData.email);
  //   return user;
  // }
  @Post('local/resetPassword')
  @HttpCode(HttpStatus.CREATED) //MB DO GET API CREATED RESPONSE INSTEAD
  async resetPassword(@Body() dto: AccountToResetPasswordDto): Promise<String> {
    await this.emailConfirmationService.sendResetPasswordLink(dto.email);
    return STATUS_CODES.OK;
    //TODO: AWP-22: add proper throw for dupplicate email
  }

  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED) //MB DO GET API CREATED RESPONSE INSTEAD
  async signupLocal(@Body() dto: SignUpDto): Promise<String> {
    await this.emailConfirmationService.sendVerificationLink(dto.email);
    return this.authService.signupLocal(dto);
    //TODO: AWP-22: add proper throw for dupplicate email
  }
  @Post('local/signin')
  @HttpCode(HttpStatus.OK)
  signinLocal(@Body() dto: AuthDto): Promise<Tokens> {
    try {
      return this.authService.signinLocal(dto);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        // handle email
        // await this.emailConfirmationService.sendVerificationLink(dto.email);
        throw new UnauthorizedException('Invalid Emails');
      }
      // Handle other errors or re-throw if needed
      throw error;
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  @ApiBearerAuth('jwt')
  @HttpCode(HttpStatus.OK)
  logout(@Req() req: Request) {
    const user = req.user;
    return this.authService.logout(user['sub']);
  }
  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  @ApiBearerAuth('jwt')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ): Promise<Tokens> {
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
//TODO: USE ARGON INSTEAD OF BCRYPT FOR HASING
