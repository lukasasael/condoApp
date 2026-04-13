import { Injectable, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan } from 'typeorm';
import { AutorizacaoVisita, VisitaStatus } from '../entities/autorizacao-visita.entity';
import { Ocorrencia, OcorrenciaStatus } from '../entities/ocorrencia.entity';
import { Reserva, ReservaStatus } from '../entities/reserva.entity';
import { CreateVisitaDto, CreateOcorrenciaDto, CreateReservaDto } from '../dto/operations.dto';

@Injectable()
export class OperationsService {
  constructor(
    @InjectRepository(AutorizacaoVisita) private visitaRepo: Repository<AutorizacaoVisita>,
    @InjectRepository(Ocorrencia) private ocorrenciaRepo: Repository<Ocorrencia>,
    @InjectRepository(Reserva) private reservaRepo: Repository<Reserva>,
  ) {}

  async createVisita(dto: CreateVisitaDto, usuario: any) {
    const nova = this.visitaRepo.create({
      ...dto,
      condominioId: usuario.condominioId,
      criadoPorUsuarioId: usuario.id,
    });
    return this.visitaRepo.save(nova);
  }

  async getVisitasAtivasHoje(condominioId: string, dataHoje: string) {
    return this.visitaRepo.find({
      where: { condominioId, dataVisita: dataHoje, status: VisitaStatus.ATIVA },
    });
  }

  async getMinhasVisitas(usuarioId: string) {
    return this.visitaRepo.find({
      where: { criadoPorUsuarioId: usuarioId },
      order: { dataVisita: 'DESC' },
    });
  }

  async putEntradaVisita(visitaId: string, condominioId: string) {
    const visita = await this.visitaRepo.findOne({ where: { id: visitaId, condominioId } });
    if (!visita) throw new NotFoundException('Visita não encontrada');
    visita.status = VisitaStatus.UTILIZADA;
    return this.visitaRepo.save(visita);
  }

  async createOcorrencia(dto: CreateOcorrenciaDto, usuario: any) {
    const nova = this.ocorrenciaRepo.create({
      ...dto,
      condominioId: usuario.condominioId,
      criadoPorUsuarioId: usuario.id,
    });
    return this.ocorrenciaRepo.save(nova);
  }

  async listOcorrencias(condominioId: string) {
    return this.ocorrenciaRepo.find({
      where: { condominioId },
      order: { criadoEm: 'DESC' },
    });
  }

  async getMinhasOcorrencias(usuarioId: string) {
    return this.ocorrenciaRepo.find({
      where: { criadoPorUsuarioId: usuarioId },
      order: { criadoEm: 'DESC' },
    });
  }

  async listReservas(condominioId: string) {
    return this.reservaRepo.find({
      where: { condominioId },
      order: { dataReserva: 'DESC' },
    });
  }

  async getMinhasReservas(usuarioId: string) {
    return this.reservaRepo.find({
      where: { criadoPorUsuarioId: usuarioId },
      order: { dataReserva: 'DESC' },
    });
  }

  async resolveOcorrencia(ocorrenciaId: string, usuario: any) {
    const ocorrencia = await this.ocorrenciaRepo.findOne({ where: { id: ocorrenciaId, condominioId: usuario.condominioId } });
    if (!ocorrencia) throw new NotFoundException('Ocorrência não encontrada');
    
    ocorrencia.status = OcorrenciaStatus.RESOLVIDA;
    ocorrencia.resolvidoPorUsuarioId = usuario.id;
    ocorrencia.resolvidoEm = new Date();
    
    return this.ocorrenciaRepo.save(ocorrencia);
  }

  // Lógica crítica validando conflito de áreas
  async createReserva(dto: CreateReservaDto, usuario: any) {
    // Busca se existe reserva na mesma área, no mesmo dia, e cujos horários se choquem
    const conflito = await this.reservaRepo.createQueryBuilder('reserva')
      .where('reserva.condominioId = :condominioId', { condominioId: usuario.condominioId })
      .andWhere('reserva.areaNome = :areaNome', { areaNome: dto.areaNome })
      .andWhere('reserva.dataReserva = :dataReserva', { dataReserva: dto.dataReserva })
      .andWhere('reserva.status IN (:...status)', { status: [ReservaStatus.PENDENTE, ReservaStatus.APROVADA] })
      .andWhere(
        '((reserva.inicio <= :fim AND reserva.inicio >= :inicio) OR (reserva.fim >= :inicio AND reserva.fim <= :fim) OR (reserva.inicio <= :inicio AND reserva.fim >= :fim))',
        { inicio: dto.inicio, fim: dto.fim }
      )
      .getOne();

    if (conflito) {
      throw new ConflictException('Já existe uma reserva para esta área e horário ou colidindo com esta janela.');
    }

    const nova = this.reservaRepo.create({
      ...dto,
      condominioId: usuario.condominioId,
      criadoPorUsuarioId: usuario.id,
    });
    return this.reservaRepo.save(nova);
  }
}
