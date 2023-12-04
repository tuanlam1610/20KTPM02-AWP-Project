import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RtStrategy } from './strategies/rt.strategy';
import { AtStrategy } from './strategies/at.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EmailConfirmationService } from 'src/email-confirmation/email-confirmation.service';
import { EmailsModule } from 'src/emails/emails.module';
import { UsersModule } from 'src/users/users.module';
import { FirebaseService } from 'src/firebase/firebase.service';

@Module({
  imports: [JwtModule.register({}), EmailsModule, UsersModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    ConfigService,
    AtStrategy,
    RtStrategy,
    EmailConfirmationService,
    FirebaseService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
