import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { isEmpty, isNotEmptyObject, isObject } from 'class-validator';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class UserAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (
      isEmpty(request.user) ||
      !isObject(request.user) ||
      !isNotEmptyObject(request.user)
    ) {
      throw new UnauthorizedException(`Invalid JWT token`);
    }

    const { userId, userName } = request.user;
    const user = await this.authService.getUserByUserName(userName);
    if (!user) return false;
    if (user.id !== userId) return false;

    return true;
  }
}
