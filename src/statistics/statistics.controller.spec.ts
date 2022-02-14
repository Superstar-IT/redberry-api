import { CanActivate } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UserEntity } from '../auth/entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { StatFilterOptDto } from './dtos/statistics.dto';
import { CountryEntity } from './entities/country.entity';
import { StatisticsEntity } from './entities/statistics.entity';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { StatsValidator } from './validators/statistics.validator';
import { UserAuthGuard } from '../core/guards/user-auth.guard';
import { JwtStrategy } from '../core/guards/jwt.strategy';
import { jwtConstant } from '../core/constants/basic';
import { exec } from 'child_process';

describe('StatisticsController', () => {
  let controller: StatisticsController;
  let service: StatisticsService;
  let validator: StatsValidator;
  let stat: StatisticsEntity;
  let country: CountryEntity;

  beforeEach(async () => {
    country = new CountryEntity();
    country.id = 1;
    country.code = 'CN';

    stat = new StatisticsEntity();
    stat.id = 1;
    stat.confirmed = 1;
    stat.death = 0;
    stat.recovered = 0;
    stat.country = country;

    const mock_userAuthGuard: CanActivate = {
      canActivate: jest.fn(() => true),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: jwtConstant.secret,
        }),
      ],
      controllers: [StatisticsController],
      providers: [
        {
          provide: StatisticsService,
          useValue: {
            getCountryByCode: jest
              .fn()
              .mockImplementation((code: string) => Promise.resolve(country)),
            findStats: jest
              .fn()
              .mockImplementation((filterOpt: StatFilterOptDto) =>
                Promise.resolve([[stat], 1]),
              ),
            getSummary: jest
              .fn()
              .mockImplementation(() =>
                Promise.resolve({ confirmed: 1, recovered: 0, death: 0 }),
              ),
          },
        },
        {
          provide: StatsValidator,
          useValue: {
            validateFilterOptDto: jest
              .fn()
              .mockImplementation((filterOpt: StatFilterOptDto) =>
                Promise.resolve(filterOpt),
              ),
          },
        },
        {
          provide: getRepositoryToken(UserEntity),
          useClass: UserEntity,
        },
        {
          provide: JwtStrategy,
          useValue: {
            validate: jest
              .fn()
              .mockResolvedValue((req: Request, payload: any) =>
                Promise.resolve({
                  userId: payload.userId,
                  userName: payload.userName,
                }),
              ),
          },
        },
      ],
    })
      .overrideGuard(UserAuthGuard)
      .useValue(mock_userAuthGuard)
      .compile();

    controller = module.get<StatisticsController>(StatisticsController);
    service = module.get<StatisticsService>(StatisticsService);
    validator = module.get<StatsValidator>(StatsValidator);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return summary of statistics', async () => {
    const summary = await controller.getSummary();

    expect(summary).toBeDefined();
    expect(summary).toEqual({ confirmed: 1, recovered: 0, death: 0 });

    expect(service.getSummary).toHaveBeenCalledTimes(1);
  });

  it('should return statistics data of all countries', async () => {
    const { data, count } = await controller.getAllCountries({});

    expect(validator.validateFilterOptDto).toHaveBeenCalledTimes(1);
    expect(service.findStats).toHaveBeenCalledTimes(1);
    expect(data).toBeDefined();
    expect(data).toBeInstanceOf(Array);
    expect(data.length).toBe(1);
    expect(count).toBeDefined();
    expect(count).toBe(1);
  });

  it('should return statistics data of China', async () => {
    const filterOpt: StatFilterOptDto = { countryCode: 'CN' };
    const { data, count } = await controller.getAllCountries(filterOpt);

    expect(validator.validateFilterOptDto).toHaveBeenCalledTimes(1);
    expect(service.findStats).toHaveBeenCalledTimes(1);
    expect(data).toBeDefined();
    expect(data).toBeInstanceOf(Array);
    expect(data.length).toBe(1);
    expect(count).toBeDefined();
    expect(count).toBe(1);
  });
});
