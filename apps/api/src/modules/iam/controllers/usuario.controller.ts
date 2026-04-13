import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsuarioService } from '../services/usuario.service';
import { CreateUsuarioDto } from '../dto/usuario.dto';
import { JwtAuthGuard } from '../../../core/auth/jwt-auth.guard';
import { RolesGuard } from '../../../core/auth/roles.guard';
import { Roles } from '../../../core/auth/roles.decorator';
import { UserRole } from '../entities/usuario.entity';

@ApiTags('Usuarios')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  @Roles(UserRole.ADMIN) // APENAS O SÍNDICO CRIA ACESSOS DE ACORDO COM A REGRA
  @ApiOperation({ summary: 'Criar novo usuário (Apenas ADMIN)' })
  async create(@Body() dto: CreateUsuarioDto) {
    return this.usuarioService.create(dto);
  }
}
