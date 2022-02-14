import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async getUserByUserName(userName: string): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { userName } }).catch((err) => {
      throw new InternalServerErrorException(
        `Failed to get user by username. ${err.message}`,
      );
    });
  }

  async saveUser(user: UserEntity): Promise<UserEntity> {
    return this.userRepository.save(user).catch((err) => {
      throw new InternalServerErrorException(
        `Failed to save user. ${err.message}`,
      );
    });
  }
}
