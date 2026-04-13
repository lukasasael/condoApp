import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../entities/usuario.entity';
import { CreateUsuarioDto } from '../dto/usuario.dto';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async create(dto: CreateUsuarioDto): Promise<Omit<Usuario, 'passwordHash'>> {
    // Unique rule logic (Tenant-Scoped)
    const existing = await this.usuarioRepository.findOne({
      where: { email: dto.email, condominioId: dto.condominioId },
    });
    
    if (existing) {
      throw new ConflictException('Já existe um usuário com este email neste condomínio.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    const usuario = this.usuarioRepository.create({
      condominioId: dto.condominioId,
      nome: dto.nome,
      email: dto.email,
      telefone: dto.telefone,
      role: dto.role,
      passwordHash,
    });

    const saved = await this.usuarioRepository.save(usuario);
    const { passwordHash: _, ...result } = saved;
    return result as Omit<Usuario, 'passwordHash'>;
  }

  async findByEmail(email: string, condominioId: string): Promise<Usuario | null> {
    return this.usuarioRepository.findOne({ where: { email, condominioId } });
  }

  // Acesso universal por email independente do condomínio (Para fluxo de Login genérico)
  async findByEmailGlobal(email: string): Promise<Usuario | null> {
    return this.usuarioRepository.findOne({ where: { email } });
  }
}
