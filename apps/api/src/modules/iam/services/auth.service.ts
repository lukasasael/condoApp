import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuarioService } from './usuario.service';
import { LoginDto } from '../dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUserAndSign(dto: LoginDto) {
    const user = await this.usuarioService.findByEmailGlobal(dto.email);
    
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    if (!user.status) {
      throw new UnauthorizedException('Usuário inativo.');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      condominioId: user.condominioId,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        nome: user.nome,
        role: user.role,
        condominioId: user.condominioId,
      }
    };
  }
}
