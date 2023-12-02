import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { EmailsModule } from './emails/emails.module';
import { EmailConfirmationController } from './email-confirmation/email-confirmation.controller';
import { EmailConfirmationService } from './email-confirmation/email-confirmation.service';
import { EmailConfirmationModule } from './email-confirmation/email-confirmation.module';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from './prisma/prisma.module';
import { FirebaseService } from './firebase/firebase.service';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EmailsModule,
    EmailConfirmationModule,
    JwtModule.register({}),
  ],
  controllers: [AppController, EmailConfirmationController],
  providers: [AppService, EmailConfirmationService, FirebaseService],
})
export class AppModule {}
