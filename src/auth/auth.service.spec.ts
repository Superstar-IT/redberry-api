import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from '../core/guards/jwt.strategy';
import { jwtConstant } from '../core/constants/basic';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/auth.dto';
import { UserEntity } from './entities/user.entity';
import { AuthValidator } from './validators/auth.validator';

describe('AuthService', () => {
  let service: AuthService;
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
      providers: [
        {
          provide: AuthService,
          useValue: {
            getUserByUserName: jest
              .fn()
              .mockImplementation((userName: string) => Promise.resolve(user)),
            saveUser: jest
              .fn()
              .mockImplementation((user: UserEntity) => Promise.resolve(user)),
          },
        },
        JwtStrategy,
        AuthValidator,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
