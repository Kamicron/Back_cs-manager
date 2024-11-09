import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    console.log('user', user);

    if (!user) {
      return false;
    }

    // Si l'utilisateur est admin, il peut accéder à toutes les ressources
    if (user.isAdmin || user.level >= 100) {
      return true;
    }

    // Si un rôle est requis et que l'utilisateur n'a pas ce rôle
    if (roles && !roles.includes(user.role)) {
      return false;
    }

    // Vérification pour l'accès utilisateur standard : l'ID doit correspondre
    const userIdFromParam = request.params.id;
    return userIdFromParam === user.userId;
  }
}
