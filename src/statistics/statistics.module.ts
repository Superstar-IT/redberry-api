import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountryEntity } from './entities/country.entity';
import { StatisticsEntity } from './entities/statistics.entity';
import { AuthModule } from '../auth/auth.module';
import { StatsValidator } from './validators/statistics.validator';

@Module({
  imports: [
    TypeOrmModule.forFeature([CountryEntity, StatisticsEntity]),
    AuthModule,
  ],
  providers: [StatisticsService, StatsValidator],
  controllers: [StatisticsController],
  exports: [StatisticsService],
})
export class StatisticsModule {}
