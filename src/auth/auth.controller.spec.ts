import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import * as bcrypt from 'bcryptjs';

import { JwtStrategy } from '../core/guards/jwt.strategy';
import { jwtConstant } from '../core/constants/basic';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/auth.dto';
import { UserEntity } from './entities/user.entity';
import { AuthValidator } from './validators/auth.validator';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;
  let validator: AuthValidator;
  let user: UserEntity;

  const loginDto: LoginDto = { userName: 'username', password: 'password' };

  beforeEach(async () => {
    user = new UserEntity();
    user.id = 1;
    user.userName = loginDto.userName;
    user.password = loginDto.password;
    user.hashPassword = jest.fn().mockImplementation(() => {
      user.password = loginDto.password;
    });
    user.validatePassword = jest.fn().mockImplementation((password) => {
      return Promise.resolve(password == user.password);
    });

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: jwtConstant.secret,
        }),
      ],
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            getUserByUserName: jest
              .fn()
              .mockImplementation((userName: string) =>
                Promise.resolve(userName === loginDto.userName ? user : null),
              ),
            saveUser: jest
              .fn()
              .mockImplementation((user: UserEntity) => Promise.resolve(user)),
          },
        },
        {
          provide: JwtStrategy,
          useValue: {
            validate: jest
              .fn()
              .mockImplementation((req: Request, payload: any) =>
                Promise.resolve({
                  userId: payload.userId,
                  userName: payload.userName,
                }),
              ),
          },
        },
        {
          provide: AuthValidator,
          useValue: {
            validateLoginDto: jest
              .fn()
              .mockImplementation((data: LoginDto) => data),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
    validator = module.get<AuthValidator>(AuthValidator);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return jwt', async () => {
    const jwt = await controller.login(loginDto);

    expect(validator.validateLoginDto).toHaveBeenCalledTimes(1);
    expect(service.getUserByUserName).toHaveBeenCalledTimes(1);
    expect(user.validatePassword).toHaveBeenCalledTimes(1);
    expect(jwt).toBeDefined();
  });

  it('should return bad request exception', async () => {
    const newLoginDto: LoginDto = { userName: 'user', password: '123456789' };
    const jwt = await controller.register(newLoginDto);

    expect(validator.validateLoginDto).toHaveBeenCalledTimes(1);
    expect(service.getUserByUserName).toHaveBeenCalledTimes(1);
    expect(service.saveUser).toHaveBeenCalledTimes(1);
    expect(jwt).toBeDefined();
  });
});
