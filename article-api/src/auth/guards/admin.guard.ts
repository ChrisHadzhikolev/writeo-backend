import {CanActivate, ExecutionContext, Injectable,} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {Observable} from 'rxjs';
import {Role} from "../enumerator/roles.enum";
import {ROLE_KEY} from "../decorators/role.decorator";

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const params = request.params;
    const user = request.user;

    const role = this.reflector.get<Role>(ROLE_KEY, context.getHandler());

    let permission = false;

    if (user.id === params.id || role == Role.Admin) {
      permission = true;
    }
    return user && permission;
  }

  checker = (arr, target) => target.every((v) => arr.includes(v));
}
