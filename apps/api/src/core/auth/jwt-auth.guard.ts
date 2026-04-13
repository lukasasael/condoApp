import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Aqui podemos colocar lógica extra se precisarmos injetar permissões abertas dinâmicas no futuro
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw err || new UnauthorizedException('Token de acesso ausente, inválido ou expirado. Faça login novamente.');
    }
    return user; // Injeta em `request.user`
  }
}
