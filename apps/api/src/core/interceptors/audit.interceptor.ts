import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Interceptor que intercepta métodos mutáveis (POST, PUT, PATCH, DELETE)
 * e injeta no fluxo de auditoria um log padronizado assíncrono.
 */
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, user } = request;

    // Se for uma requisição GET (apenas leitura), ignoramos a auditoria para não lotar o banco
    if (method === 'GET') {
      return next.handle();
    }

    const now = Date.now();

    return next.handle().pipe(
      tap((responseBody) => {
        // [FUTURO]: Aqui, enviaremos os dados para a fila ou serviço de log `log_auditoria` do Governance
        const actorId = user?.id || 'anonymous';
        const action = `${method} ${url}`;
        const delay = Date.now() - now;
        
        console.log(`[AUDIT] Action: ${action} | Actor: ${actorId} | Delay: ${delay}ms`);
        // Lógica de persistência assíncrona entrará aqui invocando o AuditService
      }),
    );
  }
}
