import {
  BadRequestException,
  Body,
  Controller,
  NotAcceptableException,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { getFromDto } from '../core/utils/repository';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/auth.dto';
import { UserEntity } from './entities/user.entity';
import { AuthValidator } from './validators/auth.validator';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
    private authValidator: AuthValidator,
  ) {}

  @Post('/login')
  @ApiOkResponse({ type: String, description: 'JWT token' })
  async login(@Body() data: LoginDto): Promise<string> {
    const validDto = this.authValidator.validateLoginDto(data);
    const user = await this.authService.getUserByUserName(validDto.userName);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    const result = await user.validatePassword(validDto.password).catch(() => {
      throw new BadRequestException(`Password incorrect`);
    });

    if (!result) {
      throw new BadRequestException(`Password incorrect`);
    }

    return this.generateToken(user);
  }

  @Post('/register')
  @ApiOkResponse({ type: String, description: 'JWT token' })
  async register(@Body() data: LoginDto): Promise<string> {
    const validDto = this.authValidator.validateLoginDto(data);
    const user = await this.authService.getUserByUserName(validDto.userName);
    if (user) {
      throw new NotAcceptableException(`username already exists.`);
    }

    let newUser = getFromDto<UserEntity>(validDto, new UserEntity());
    newUser = await this.authService.saveUser(newUser);

    return this.generateToken(newUser);
  }

  generateToken(user: UserEntity): string {
    return this.jwtService.sign({
      userId: user.id,
      userName: user.userName,
    });
  }
}
