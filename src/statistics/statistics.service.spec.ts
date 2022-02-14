import { Test, TestingModule } from '@nestjs/testing';
import { StatFilterOptDto } from './dtos/statistics.dto';
import { CountryEntity } from './entities/country.entity';
import { StatisticsEntity } from './entities/statistics.entity';
import { StatisticsService } from './statistics.service';

class ApiServiceMock {
  getCountryByCode(code: string) {
    return {};
  }

  getAllCountries() {
    return [];
  }

  saveCountries(countries: CountryEntity[]) {
    return {};
  }

  getStatByCountry(country: CountryEntity) {
    return {};
  }

  saveStats(stats: StatisticsEntity[]) {
    return {};
  }

  findStats(filterOpt: StatFilterOptDto) {
    return [];
  }

  getSummary() {
    return {};
  }
}

describe('StatisticsService', () => {
  let service: StatisticsService;

  beforeEach(async () => {
    const ApiServiceProvider = {
      provide: StatisticsService,
      useClass: ApiServiceMock,
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatisticsService, ApiServiceProvider],
    }).compile();

    service = module.get<StatisticsService>(StatisticsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call getCountryByCode method with string', async () => {
    const getCountryByCodeSpy = jest.spyOn(service, 'getCountryByCode');
    const countryCode = 'GE';

    service.getCountryByCode(countryCode);

    expect(getCountryByCodeSpy).toHaveBeenCalledWith(countryCode);
    expect(getCountryByCodeSpy).toHaveBeenCalledTimes(1);
  });

  it('should call getAllCountries method without params', async () => {
    const getAllCountriesSpy = jest.spyOn(service, 'getAllCountries');

    service.getAllCountries();

    expect(getAllCountriesSpy).toHaveBeenCalled();
    expect(getAllCountriesSpy).toHaveBeenCalledTimes(1);
  });

  it('should call saveCountries method with country list', async () => {
    const saveCountriesSpy = jest.spyOn(service, 'saveCountries');
    const countries: CountryEntity[] = [];

    service.saveCountries(countries);

    expect(saveCountriesSpy).toHaveBeenCalledWith(countries);
    expect(saveCountriesSpy).toHaveBeenCalledTimes(1);
  });

  it('should call getStatByCountry method with country', async () => {
    const getStatByCountrySpy = jest.spyOn(service, 'getStatByCountry');
    const country = new CountryEntity();

    service.getStatByCountry(country);

    expect(getStatByCountrySpy).toHaveBeenCalledWith(country);
    expect(getStatByCountrySpy).toHaveBeenCalledTimes(1);
  });

  it('should call saveStats method with statictics entity', async () => {
    const saveStatsSpy = jest.spyOn(service, 'saveStats');
    const statictics: StatisticsEntity[] = [];

    service.saveStats(statictics);

    expect(saveStatsSpy).toHaveBeenCalledWith(statictics);
    expect(saveStatsSpy).toHaveBeenCalledTimes(1);
  });

  it('should call getSummary method without params', async () => {
    const getSummarySpy = jest.spyOn(service, 'getSummary');

    service.getSummary();

    expect(getSummarySpy).toHaveBeenCalled();
    expect(getSummarySpy).toBeCalledTimes(1);
  });

  it('should call findStats method with filter option dto', async () => {
    const findStatsSpy = jest.spyOn(service, 'findStats');
    const filterOpt = new StatFilterOptDto();

    service.findStats(filterOpt);

    expect(findStatsSpy).toHaveBeenCalledWith(filterOpt);
    expect(findStatsSpy).toBeCalledTimes(1);
  });
});
