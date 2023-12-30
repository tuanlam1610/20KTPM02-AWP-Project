import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { EmailsModule } from 'src/emails/emails.module';
import { UsersModule } from 'src/users/users.module';
import { EmailConfirmationController } from './email-confirmation.controller';
import { EmailConfirmationService } from './email-confirmation.service';
import { RtStrategy } from 'src/auth/strategies/rt.strategy';
import { AtStrategy } from 'src/auth/strategies/at.strategy';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { ClassesModule } from 'src/classes/classes.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    UsersModule,
    ClassesModule,
    EmailsModule,
    AuthModule,
    JwtModule.register({}),
    FirebaseModule,
  ],
  controllers: [EmailConfirmationController],
  providers: [ConfigService, AtStrategy, RtStrategy, EmailConfirmationService],
  exports: [EmailConfirmationService],
})
export class EmailConfirmationModule {}
