import { Controller, Post, Get, Body, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { GovernanceService } from '../services/governance.service';
import { CreateComunicadoDto } from '../dto/governance.dto';
import { JwtAuthGuard } from '../../../core/auth/jwt-auth.guard';
import { RolesGuard } from '../../../core/auth/roles.guard';
import { Roles } from '../../../core/auth/roles.decorator';
import { UserRole } from '../../iam/entities/usuario.entity';

@ApiTags('Governance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('governance')
export class GovernanceController {
  constructor(private readonly governanceService: GovernanceService) {}

  @Post('comunicados')
  @Roles(UserRole.ADMIN) // Somente síndico publica ordens
  @ApiOperation({ summary: 'Criar Comunicado Oficial (Apenas ADMIN)' })
  async createComunicado(@Body() dto: CreateComunicadoDto, @Request() req: any) {
    return this.governanceService.createComunicado(dto, req.user);
  }

  @Get('comunicados')
  @Roles(UserRole.ADMIN, UserRole.RESIDENT, UserRole.PORTER) // Todos leem
  @ApiOperation({ summary: 'Ler Mural de Comunicados' })
  async getComunicados(@Request() req: any) {
    return this.governanceService.getComunicadosAtivos(req.user.condominioId);
  }

  @Get('logs')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Consultar Trilha de Auditoria (Apenas ADMIN)' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getLogsAuditoria(@Query('limit') limit: string, @Request() req: any) {
    return this.governanceService.getLogs(req.user.condominioId, limit ? parseInt(limit) : 50);
  }
}
