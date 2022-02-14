import axios from 'axios';
import { CountryInterface } from '../../statistics/interfaces/country.interface';
import { CountryStatInterface } from '../../statistics/interfaces/statistics.interface';

export const getCountries = async (): Promise<CountryInterface[]> => {
  return axios
    .get('https://devtest.ge/countries')
    .then((res) => res.data)
    .catch((err) => {
      throw new Error(`Failed to get counties.`);
    });
};

export const getStatOfCountry = async (
  code: string,
): Promise<CountryStatInterface> => {
  return axios
    .post('https://devtest.ge/get-country-statistics', { code })
    .then((res) => res.data)
    .catch((err) => {
      throw new Error(`Failed to get statistics for "${code}"`);
    });
};
