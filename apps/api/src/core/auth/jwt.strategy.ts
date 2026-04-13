import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'chave-secreta-condominio-mvp-estrita', // Em prod, venha do .env
    });
  }

  // O payload retornado aqui é injetado automaticamente pelo NestJS no `req.user`
  async validate(payload: any) {
    return { 
      id: payload.sub, 
      email: payload.email, 
      role: payload.role, 
      condominioId: payload.condominioId 
    };
  }
}
