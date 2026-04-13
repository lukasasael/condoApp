import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FacilitiesService } from '../services/facilities.service';
import { CreateCondominioDto, CreateUnidadeDto } from '../dto/facilities.dto';
import { JwtAuthGuard } from '../../../core/auth/jwt-auth.guard';
import { RolesGuard } from '../../../core/auth/roles.guard';
import { Roles } from '../../../core/auth/roles.decorator';
import { UserRole } from '../../iam/entities/usuario.entity';

@ApiTags('Facilities')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('facilities')
export class FacilitiesController {
  constructor(private readonly facilitiesService: FacilitiesService) {}

  @Post('condominios')
  @Roles(UserRole.ADMIN) // Somente root/admins criam condomínios multi-tenant
  @ApiOperation({ summary: 'Criar Condomínio (Apenas ADMIN)' })
  async createCondominio(@Body() dto: CreateCondominioDto) {
    return this.facilitiesService.createCondominio(dto);
  }

  @Post('unidades')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Criar Unidade Vinculada (Apenas ADMIN)' })
  async createUnidade(@Body() dto: CreateUnidadeDto) {
    return this.facilitiesService.createUnidade(dto);
  }

  @Get('condominios/:condominioId/unidades')
  @Roles(UserRole.ADMIN, UserRole.PORTER, UserRole.RESIDENT)
  @ApiOperation({ summary: 'Listar Unidades de um Condomínio' })
  async getUnidades(@Param('condominioId') condominioId: string) {
    return this.facilitiesService.getUnidades(condominioId);
  }
}
