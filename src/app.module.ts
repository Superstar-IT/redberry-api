import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

import * as OrmConfig from './orm.config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StatisticsModule } from './statistics/statistics.module';
import { AuthModule } from './auth/auth.module';
import { CronService } from './cron/cron.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(OrmConfig),
    ScheduleModule.forRoot(),
    StatisticsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, CronService],
})
export class AppModule {}
