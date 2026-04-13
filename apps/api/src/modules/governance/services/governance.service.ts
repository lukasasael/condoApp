import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comunicado } from '../entities/comunicado.entity';
import { LogAuditoria } from '../entities/log-auditoria.entity';
import { CreateComunicadoDto } from '../dto/governance.dto';

@Injectable()
export class GovernanceService {
  constructor(
    @InjectRepository(Comunicado) private comunicadoRepo: Repository<Comunicado>,
    @InjectRepository(LogAuditoria) private logRepo: Repository<LogAuditoria>,
  ) {}

  async createComunicado(dto: CreateComunicadoDto, usuario: any) {
    const novo = this.comunicadoRepo.create({
      ...dto,
      condominioId: usuario.condominioId,
      autorUsuarioId: usuario.id,
    });
    return this.comunicadoRepo.save(novo);
  }

  async getComunicadosAtivos(condominioId: string) {
    return this.comunicadoRepo.find({
      where: { condominioId, ativo: true },
      order: { publicadoEm: 'DESC' },
    });
  }

  async getLogs(condominioId: string, limit = 50) {
    // Retorna a trilha de auditoria para os relatórios do perfil ADMIN
    return this.logRepo.find({
      where: { condominioId },
      order: { criadoEm: 'DESC' },
      take: limit,
    });
  }
}
