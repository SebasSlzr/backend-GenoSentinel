import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // Simulación de validación de token JWT
    const authHeader = request.headers.authorization;
    
    if (!authHeader) {
      throw new UnauthorizedException('Token de autorización no proporcionado');
    }
    
    const token = authHeader.replace('Bearer ', '');
    
    // Validación simulada - en producción validarías con el servicio de autenticación
    if (!this.isValidToken(token)) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
    
    // Agregar información del usuario al request
    request.user = {
      id: 'simulated-user-id',
      role: 'clinico', // Rol único según el enunciado
      token: token,
    };
    
    return true;
  }
  
  private isValidToken(token: string): boolean {
    // Simulación: acepta cualquier token que empiece con 'valid-'
    return token.startsWith('valid-') || token.startsWith('eyJ'); // También acepta formato JWT real
  }
}