import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { EmailsModule } from 'src/emails/emails.module';
import EmailsService from 'src/emails/emails.service';
import { UsersModule } from 'src/users/users.module';
import { EmailConfirmationController } from './email-confirmation.controller';
import { EmailConfirmationService } from './email-confirmation.service';
import { RtStrategy } from 'src/auth/strategies/rt.strategy';
import { AtStrategy } from 'src/auth/strategies/at.strategy';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    EmailsModule,
    AuthModule,
    JwtModule.register({}),
  ],
  controllers: [EmailConfirmationController],
  providers: [
    ConfigService,
    AtStrategy,
    RtStrategy,
    EmailConfirmationService,
    AuthService,
  ],
  exports: [EmailConfirmationService],
})
export class EmailConfirmationModule {}
