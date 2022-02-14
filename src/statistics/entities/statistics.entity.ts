import { AbstractEntity } from '../../core/entity/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CountryEntity } from './country.entity';

@Entity('statistics')
export class StatisticsEntity extends AbstractEntity {
  @Column({ type: 'int', default: 0 })
  confirmed: number;

  @Column({ type: 'int', default: 0 })
  recovered: number;

  @Column({ type: 'int', default: 0 })
  death: number;

  @ManyToOne(() => CountryEntity)
  @JoinColumn()
  country: CountryEntity;
}
