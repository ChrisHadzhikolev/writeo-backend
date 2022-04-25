import {
  CanActivate,
  ExecutionContext,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const params = request.params;
    const user = request.user;

    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    let permission = false;

    if (user.id === params.id || roles.includes('admin')) {
      permission = true;
    }
    return user && permission;
  }

  checker = (arr, target) => target.every((v) => arr.includes(v));
}
