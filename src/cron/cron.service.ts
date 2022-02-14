import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as moment from 'moment';
import { getStatOfCountry } from '../core/services/utils.service';
import { CountryEntity } from '../statistics/entities/country.entity';
import { StatisticsEntity } from '../statistics/entities/statistics.entity';
import { StatisticsService } from '../statistics/statistics.service';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);
  constructor(private statService: StatisticsService) {}

  @Cron(CronExpression.EVERY_10_MINUTES, { name: 'syncStatisctics' })
  async syncStatisctics() {
    const newStatList: StatisticsEntity[] = [];
    const countries = await this.statService.getAllCountries().catch((err) => {
      this.logger.debug(`Failed to get countries. ${err.message}`);
      return [] as CountryEntity[];
    });

    for await (const country of countries) {
      await this.statService
        .getStatByCountry(country)
        .then(async (stat) => {
          const lastUpdated = stat ? moment(stat.updatedAt) : moment();

          if (moment().diff(lastUpdated, 'days') > 1) {
            const newStatData = await getStatOfCountry(country.code);
            const newStat = stat || new StatisticsEntity();
            newStat.confirmed = newStatData.confirmed;
            newStat.recovered = newStat.recovered;
            newStat.death = newStat.death;
            if (stat) newStat.id = stat.id;
            if (!stat) newStat.country = country;
            newStatList.push(newStat);
          }
        })
        .catch((err) => {
          this.logger.debug(
            `Failed to get statistics by country. ${err.message}`,
          );
          return null;
        });
    }

    if (newStatList.length) {
      await this.statService.saveStats(newStatList).catch((err) => {
        this.logger.debug(`Failed to synchronize statisctics. ${err.message}`);
        return null;
      });
    }
  }
}
