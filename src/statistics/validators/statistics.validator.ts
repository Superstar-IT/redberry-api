import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { isNotEmpty, matches } from 'class-validator';
import { StatFilterOptDto } from '../dtos/statistics.dto';
import { StatisticsService } from '../statistics.service';

@Injectable()
export class StatsValidator {
  constructor(private statService: StatisticsService) {}

  async validateFilterOptDto(
    filterOpt: StatFilterOptDto,
  ): Promise<StatFilterOptDto> {
    if (isNotEmpty(filterOpt.countryCode)) {
      if (!matches(filterOpt.countryCode, /^[A-Z]{2}$/)) {
        throw new BadRequestException(`Invalid country code`);
      }

      const country = await this.statService
        .getCountryByCode(filterOpt.countryCode)
        .catch((err) => {
          throw new InternalServerErrorException(
            `Failed to get country by code. ${err.message}`,
          );
        });
      if (!country) {
        throw new NotFoundException(`Country not found`);
      }
    }
    return filterOpt;
  }
}
