import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from 'src/api/auth/auth.service';
import { UserService } from 'src/api/user/user.service';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requierdRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    if (!requierdRoles) return true; //No roles specified access allowed

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user || !user.id) {
      throw new UnauthorizedException();
    }
    const userRole = await this.userService.getUserRoleById(user.id);

    if (!requierdRoles.includes(userRole)) {
      throw new ForbiddenException(
        `User doesn't have the required roles`,
      );
    }

    return true;
  }
}
