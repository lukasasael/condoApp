import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Condominio } from '../entities/condominio.entity';
import { Unidade } from '../entities/unidade.entity';
import { CreateCondominioDto, CreateUnidadeDto } from '../dto/facilities.dto';

@Injectable()
export class FacilitiesService {
  constructor(
    @InjectRepository(Condominio)
    private condominiosRepo: Repository<Condominio>,
    @InjectRepository(Unidade)
    private unidadesRepo: Repository<Unidade>,
  ) {}

  async createCondominio(dto: CreateCondominioDto): Promise<Condominio> {
    const novo = this.condominiosRepo.create(dto);
    return this.condominiosRepo.save(novo);
  }

  async createUnidade(dto: CreateUnidadeDto): Promise<Unidade> {
    const existing = await this.unidadesRepo.findOne({
      where: { condominioId: dto.condominioId, codigo: dto.codigo, bloco: dto.bloco ? dto.bloco : IsNull() },
    });
    if (existing) {
      throw new ConflictException('Unidade já cadastrada com este código e bloco no condomínio.');
    }
    const nova = this.unidadesRepo.create(dto);
    return this.unidadesRepo.save(nova);
  }

  async getUnidades(condominioId: string): Promise<Unidade[]> {
    return this.unidadesRepo.find({ where: { condominioId } });
  }
}
