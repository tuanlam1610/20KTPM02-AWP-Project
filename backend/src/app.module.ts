import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { EmailsModule } from './emails/emails.module';
import { EmailConfirmationModule } from './email-confirmation/email-confirmation.module';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from './prisma/prisma.module';
import { FirebaseService } from './firebase/firebase.service';
import { FirebaseModule } from './firebase/firebase.module';
import { StudentsModule } from './students/students.module';
import { TeachersModule } from './teachers/teachers.module';
import { ClassesModule } from './classes/classes.module';
import { GradeCompositionsModule } from './grade-compositions/grade-compositions.module';
import { GradeReviewsModule } from './grade-reviews/grade-reviews.module';
import { CommentsModule } from './comments/comments.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/guards/roles.guard';
import { StudentGradesModule } from './student-grades/student-grades.module';
import { NotificationsModule } from './notifications/notifications.module';

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
    FirebaseModule,
    StudentsModule,
    TeachersModule,
    ClassesModule,
    GradeCompositionsModule,
    GradeReviewsModule,
    CommentsModule,
    StudentGradesModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,

    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // },
  ],
})
export class AppModule {}
