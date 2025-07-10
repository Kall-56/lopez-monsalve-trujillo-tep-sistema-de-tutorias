import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { Request, Response } from 'express';
import { LoggingService } from '../logging.service';
import { LOG_REQUEST_KEY, LogRequestOptions } from '../decorators/log-request.decorator';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  constructor(
    private readonly loggingService: LoggingService,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const handler = context.getHandler();
    
    // Obtener configuración del decorador
    const logOptions: LogRequestOptions = this.reflector.get(
      LOG_REQUEST_KEY,
      handler,
    ) || { level: 'INFO' };

    const startTime = Date.now();
    const method = request.method;
    const url = request.url;
    const userAgent = request.get('User-Agent') || '';
    const ipAddress = this.getClientIp(request);

    // Extraer información del usuario si está disponible
    const user = (request as any).user;
    const userId = user?.id;
    const userRole = user?.role;

    // Preparar datos del request para logging
    let requestBody = null;
    if (logOptions.includeRequestBody && request.body) {
      requestBody = this.sanitizeData(request.body, logOptions.excludeSensitiveFields);
    }

    this.logger.log(`Incoming ${method} request to ${url} from ${ipAddress}`);

    return next.handle().pipe(
      tap((data) => {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        const statusCode = response.statusCode;

        // Preparar datos de la respuesta para logging
        let responseBody = null;
        if (logOptions.includeResponseBody && data) {
          responseBody = this.sanitizeData(data, logOptions.excludeSensitiveFields);
        }

        // Crear log de éxito usando la nueva estructura
        this.loggingService.createRequestLog({
          method,
          endpoint: url,
          userId: userId ? parseInt(userId) : undefined,
          userRole,
          ipAddress,
          userAgent,
          requestBody,
          responseBody,
          statusCode,
          responseTime,
          level: logOptions.level || 'INFO',
        });

        this.logger.log(
          `${method} ${url} ${statusCode} - ${responseTime}ms`,
        );
      }),
      catchError((error) => {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        const statusCode = error.status || 500;
        const errorMessage = error.message || 'Internal server error';

        // Crear log de error usando la nueva estructura
        this.loggingService.createRequestLog({
          method,
          endpoint: url,
          userId: userId ? parseInt(userId) : undefined,
          userRole,
          ipAddress,
          userAgent,
          requestBody,
          statusCode,
          responseTime,
          errorMessage,
          level: 'ERROR',
        });

        this.logger.error(
          `${method} ${url} ${statusCode} - ${responseTime}ms - ${errorMessage}`,
          error.stack,
        );

        throw error;
      }),
    );
  }

  private getClientIp(request: Request): string {
    return (
      request.headers['x-forwarded-for'] as string ||
      request.headers['x-real-ip'] as string ||
      request.connection.remoteAddress ||
      request.socket.remoteAddress ||
      'unknown'
    );
  }

  private sanitizeData(data: any, excludeFields: string[] = []): any {
    if (!data || typeof data !== 'object') {
      return data;
    }

    const sanitized = { ...data };
    
    excludeFields.forEach(field => {
      if (sanitized[field] !== undefined) {
        sanitized[field] = '[REDACTED]';
      }
    });

    return sanitized;
  }
} 