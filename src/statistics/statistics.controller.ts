import {
  Controller,
  Get,
  InternalServerErrorException,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaginatorDto } from '../core/dto/paginator.dto';
import { JwtAuthGuard } from '../core/guards/jwt-auth.guard';
import { UserAuthGuard } from '../core/guards/user-auth.guard';
import { StatFilterOptDto } from './dtos/statistics.dto';
import { StatisticsEntity } from './entities/statistics.entity';
import { StatSummaryInterface } from './interfaces/statistics.interface';
import { StatisticsService } from './statistics.service';
import { StatsValidator } from './validators/statistics.validator';

@Controller('statistics')
@ApiTags('Statistics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, UserAuthGuard)
export class StatisticsController {
  constructor(
    private statService: StatisticsService,
    private validator: StatsValidator,
  ) {}

  @Get('')
  async getAllCountries(
    @Query() filterOpt: StatFilterOptDto,
  ): Promise<PaginatorDto<StatisticsEntity>> {
    const validFilterOpt = await this.validator.validateFilterOptDto(filterOpt);
    const [data, count] = await this.statService
      .findStats(validFilterOpt)
      .catch((err) => {
        throw new InternalServerErrorException(
          `Failed to get statistics of countries. ${err.message}`,
        );
      });

    return { data, count };
  }

  @Get('/summary')
  async getSummary(): Promise<StatSummaryInterface> {
    const result = await this.statService.getSummary().catch((err) => {
      throw new InternalServerErrorException(
        `Failed to get summary of statistics. ${err.message}`,
      );
    });
    return result;
  }
}
