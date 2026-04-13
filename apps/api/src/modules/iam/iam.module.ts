import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Usuario } from './entities/usuario.entity';
import { AuthController } from './controllers/auth.controller';
import { UsuarioController } from './controllers/usuario.controller';
import { AuthService } from './services/auth.service';
import { UsuarioService } from './services/usuario.service';
import { JwtStrategy } from '../../core/auth/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'chave-secreta-condominio-mvp-estrita',
      signOptions: { expiresIn: '8h' },
    }),
  ],
  controllers: [AuthController, UsuarioController],
  providers: [AuthService, UsuarioService, JwtStrategy],
  exports: [TypeOrmModule, AuthService, UsuarioService],
})
export class IamModule {}
