import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Role } from '../enumerator/roles.enum';
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
      console.log('here');
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    console.log(user.role);
    return requiredRole == user.role;
  }
}
