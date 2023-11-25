import { Module } from '@nestjs/common';
import EmailsService from './emails.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [],
  controllers: [],
  providers: [EmailsService, ConfigModule],
  exports: [EmailsService],
})
export class EmailsModule {}
