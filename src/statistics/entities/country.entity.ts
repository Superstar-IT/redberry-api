import { AbstractEntity } from '../../core/entity/abstract.entity';
import { Column, Entity, Unique } from 'typeorm';

@Entity('countries')
@Unique('country_unique', ['code'])
export class CountryEntity extends AbstractEntity {
  @Column({ type: 'varchar', unique: true })
  code: string;

  @Column({ type: 'jsonb' })
  name: JSON;
}
