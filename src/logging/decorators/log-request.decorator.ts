import { SetMetadata } from '@nestjs/common';

export const LOG_REQUEST_KEY = 'logRequest';

export interface LogRequestOptions {
  level?: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  includeRequestBody?: boolean;
  includeResponseBody?: boolean;
  excludeSensitiveFields?: string[];
}

/**
 * Decorador personalizado para logging de peticiones HTTP
 * Aplica programación orientada a aspectos para registrar logs automáticamente
 * 
 * @param options - Opciones de configuración para el logging
 * @returns Decorador que marca el método para ser interceptado
 * 
 * @example
 * ```typescript
 * @LogRequest({ 
 *   level: 'INFO', 
 *   includeRequestBody: true,
 *   excludeSensitiveFields: ['password'] 
 * })
 * async createUser(@Body() createUserDto: CreateUserDto) {
 *   // método que será loggeado automáticamente
 * }
 * ```
 */
export const LogRequest = (options: LogRequestOptions = {}) => {
  const defaultOptions: LogRequestOptions = {
    level: 'INFO',
    includeRequestBody: false,
    includeResponseBody: false,
    excludeSensitiveFields: ['password', 'token', 'secret'],
  };

  const finalOptions = { ...defaultOptions, ...options };
  
  return SetMetadata(LOG_REQUEST_KEY, finalOptions);
}; 