import { BeforeInsert, Column, Entity, Unique } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { AbstractEntity } from '../../core/entity/abstract.entity';

@Entity('user')
@Unique('user_unqiue', ['userName'])
export class UserEntity extends AbstractEntity {
  @Column({ type: 'varchar', unique: true })
  userName: string;

  @Column({ type: 'text' })
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 8);
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
