import { Controller, Post, Get, Patch, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { OperationsService } from '../services/operations.service';
import { CreateVisitaDto, CreateOcorrenciaDto, CreateReservaDto } from '../dto/operations.dto';
import { JwtAuthGuard } from '../../../core/auth/jwt-auth.guard';
import { RolesGuard } from '../../../core/auth/roles.guard';
import { Roles } from '../../../core/auth/roles.decorator';
import { UserRole } from '../../iam/entities/usuario.entity';

@ApiTags('Operations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('operations')
export class OperationsController {
  constructor(private readonly operationsService: OperationsService) {}

  @Post('visitas')
  @Roles(UserRole.RESIDENT, UserRole.ADMIN)
  @ApiOperation({ summary: 'Morador agenda visita' })
  async createVisita(@Body() dto: CreateVisitaDto, @Request() req: any) {
    return this.operationsService.createVisita(dto, req.user);
  }

  @Get('visitas/minhas')
  @Roles(UserRole.RESIDENT)
  @ApiOperation({ summary: 'Morador consulta suas próprias visitas agendadas' })
  async getMinhasVisitas(@Request() req: any) {
    return this.operationsService.getMinhasVisitas(req.user.id);
  }

  @Get('visitas/ativas')
  @Roles(UserRole.PORTER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Porteiro busca visitas ativas de um dia (Painel Portaria)' })
  @ApiQuery({ name: 'data', description: 'YYYY-MM-DD' })
  async getVisitasAtivas(
    @Query('data') data: string,
    @Request() req: any
  ) {
    return this.operationsService.getVisitasAtivasHoje(req.user.condominioId, data);
  }

  @Patch('visitas/:id/entrada')
  @Roles(UserRole.PORTER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Porteiro confirma entrada da visita' })
  async confirmarEntrada(@Param('id') visitaId: string, @Request() req: any) {
    return this.operationsService.putEntradaVisita(visitaId, req.user.condominioId);
  }

  @Post('ocorrencias')
  @Roles(UserRole.RESIDENT, UserRole.PORTER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Criar Ocorrência Rastreada' })
  async createOcorrencia(@Body() dto: CreateOcorrenciaDto, @Request() req: any) {
    return this.operationsService.createOcorrencia(dto, req.user);
  }

  @Get('ocorrencias')
  @Roles(UserRole.ADMIN, UserRole.PORTER)
  @ApiOperation({ summary: 'Listar todas as ocorrências do condomínio (Admin/Porteiro)' })
  async listOcorrencias(@Request() req: any) {
    return this.operationsService.listOcorrencias(req.user.condominioId);
  }

  @Get('ocorrencias/minhas')
  @Roles(UserRole.RESIDENT)
  @ApiOperation({ summary: 'Morador consulta suas próprias ocorrências' })
  async getMinhasOcorrencias(@Request() req: any) {
    return this.operationsService.getMinhasOcorrencias(req.user.id);
  }

  @Get('reservas')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Listar todas as reservas do condomínio (Admin)' })
  async listReservas(@Request() req: any) {
    return this.operationsService.listReservas(req.user.condominioId);
  }

  @Get('reservas/minhas')
  @Roles(UserRole.RESIDENT)
  @ApiOperation({ summary: 'Morador consulta suas próprias reservas' })
  async getMinhasReservas(@Request() req: any) {
    return this.operationsService.getMinhasReservas(req.user.id);
  }

  @Patch('ocorrencias/:id/resolver')
  @Roles(UserRole.ADMIN, UserRole.PORTER) // Porteiro também pode resolver coisas pequenas dele
  @ApiOperation({ summary: 'Resolver Ocorrência (Adiciona log e Timestamp)' })
  async resolverOcorrencia(@Param('id') ocorrenciaId: string, @Request() req: any) {
    return this.operationsService.resolveOcorrencia(ocorrenciaId, req.user);
  }

  @Post('reservas')
  @Roles(UserRole.RESIDENT, UserRole.ADMIN)
  @ApiOperation({ summary: 'Morador cria reserva de Área (Valida Conflitos)' })
  async createReserva(@Body() dto: CreateReservaDto, @Request() req: any) {
    return this.operationsService.createReserva(dto, req.user);
  }
}
