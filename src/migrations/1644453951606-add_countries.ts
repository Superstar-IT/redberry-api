import { getCountries } from '../core/services/utils.service';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class addCountries1644453951606 implements MigrationInterface {
  name = 'addCountries1644453951606';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const countryTable = queryRunner.getTable('countries');
    if (countryTable) {
      const countries = await getCountries();
      await Promise.all(
        countries.map(async (country) => {
          await queryRunner.query(`
          INSERT INTO "countries" ( code, name ) VALUES ('${
            country.code
          }', '${JSON.stringify(country.name).replace("'", "''")}')
      
        `);
        }),
      ).catch((err) => {
        throw new Error(`Failed to add countries. ${err.message}`);
      });

      console.log('Countries are added successfully!');
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "countries"`);
  }
}
