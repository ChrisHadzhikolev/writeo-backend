import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Role } from '../enum/roles.enum';
import { Reflector } from '@nestjs/core';
import { ROLE_KEY } from '../decorators/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.getAllAndOverride<Role>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRole) {
      return true;
    }
    console.log('rr', context.switchToHttp().getRequest()["IncomingMessage"]);
    const { user } = context.switchToHttp().getRequest();
    console.log('r', requiredRole, user);
    return requiredRole == user.role;
  }
}
