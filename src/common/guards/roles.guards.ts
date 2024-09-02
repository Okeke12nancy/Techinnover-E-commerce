import {
  Injectable,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from '../../module/auth/auth.jwt.strategy';
import { Role } from '../enum';
import { ROLES_KEY } from '../decorators/decorators.guards';

@Injectable()
export class RolesGuard extends JwtAuthGuard {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      console.log('No roles required, allowing access');
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      console.log('User is not authenticated, throwing ForbiddenException');
      throw new ForbiddenException('Forbidden');
    }

    const hasRole = requiredRoles.some((role) => user.role === role);

    if (!hasRole) {
      console.log(
        'User does not have the required role, throwing ForbiddenException',
      );
      throw new ForbiddenException('Forbidden');
    }

    console.log('User has the required role, allowing access');
    return true;
  }
}
