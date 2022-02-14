import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SuccessResponse } from '../core/dto/success-response.dto';
import { StatFilterOptDto } from './dtos/statistics.dto';
import { CountryEntity } from './entities/country.entity';
import { StatisticsEntity } from './entities/statistics.entity';
import { StatSummaryInterface } from './interfaces/statistics.interface';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(CountryEntity)
    private readonly countryRepository: Repository<CountryEntity>,
    @InjectRepository(StatisticsEntity)
    private readonly statRepository: Repository<StatisticsEntity>,
  ) {}

  async getCountryByCode(code: string): Promise<CountryEntity> {
    return this.countryRepository.findOne({ code });
  }

  async getAllCountries(): Promise<CountryEntity[]> {
    return this.countryRepository.find();
  }

  async saveCountries(countries: CountryEntity[]): Promise<SuccessResponse> {
    return this.countryRepository
      .save(countries)
      .then(() => new SuccessResponse(true));
  }

  async getStatByCountry(country: CountryEntity): Promise<StatisticsEntity> {
    return this.statRepository.findOne({ country });
  }

  async saveStats(stats: StatisticsEntity[]): Promise<SuccessResponse> {
    return this.statRepository
      .save(stats)
      .then(() => new SuccessResponse(true));
  }

  async findStats(
    filterOpt: StatFilterOptDto,
  ): Promise<[StatisticsEntity[], number]> {
    const whereClause = filterOpt.countryCode
      ? `country.code = :code`
      : `country.code NOTNULL`;
    return this.statRepository
      .createQueryBuilder('statistics')
      .leftJoinAndSelect('statistics.country', 'country')
      .where(whereClause, { code: filterOpt.countryCode })
      .orderBy('country.code', 'ASC')
      .getManyAndCount();
  }

  async getSummary(): Promise<StatSummaryInterface> {
    return this.statRepository
      .createQueryBuilder('statistics')
      .select('sum (statistics.confirmed) as confirmed')
      .addSelect('sum (statistics.recovered) as recovered')
      .addSelect('sum (statistics.death) as death')
      .getRawOne()
      .then((result) => ({
        confirmed: parseInt(result.confirmed),
        recovered: parseInt(result.recovered),
        death: parseInt(result.death),
      }));
  }
}
