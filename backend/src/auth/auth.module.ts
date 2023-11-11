import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RtStrategy } from './strategies/rt.strategy';
import { AtStrategy } from './strategies/at.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, ConfigService, AtStrategy, RtStrategy],
})
export class AuthModule {}
