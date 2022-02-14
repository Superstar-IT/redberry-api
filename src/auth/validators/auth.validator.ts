import { BadRequestException } from '@nestjs/common';
import { isEmpty, isNotEmpty, minLength } from 'class-validator';
import { LoginDto } from '../dtos/auth.dto';

export class AuthValidator {
  validateLoginDto(data: LoginDto): LoginDto {
    if (isEmpty(data.userName)) {
      throw new BadRequestException(`userName required`);
    }
    if (isNotEmpty(data.userName) && !minLength(data.userName, 4)) {
      throw new BadRequestException(`userName length should be at least 4.`);
    }

    if (isEmpty(data.password)) {
      throw new BadRequestException(`password required`);
    }
    if (!isNotEmpty(data.password) && !minLength(data.password, 8)) {
      throw new BadRequestException(`password length should be at least 8.`);
    }

    return data;
  }
}
