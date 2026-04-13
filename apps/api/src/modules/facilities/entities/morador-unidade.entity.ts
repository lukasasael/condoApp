import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Usuario } from '../../iam/entities/usuario.entity';
import { Unidade } from './unidade.entity';

@Entity('morador_unidade')
@Unique(['usuarioId', 'unidadeId'])
export class MoradorUnidade {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'usuario_id', type: 'uuid' })
  usuarioId: string;

  @Column({ name: 'unidade_id', type: 'uuid' })
  unidadeId: string;

  @Column({ name: 'tipo_vinculo', type: 'varchar', length: 100, nullable: true })
  tipoVinculo: string; // Ex: 'PROPRIETARIO', 'INQUILINO'

  @Column({ name: 'responsavel_principal', type: 'boolean', default: false })
  responsavelPrincipal: boolean;

  @Column({ type: 'boolean', default: true })
  ativo: boolean;

  // -- Timestamps --
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // -- Relacionamentos --
  @ManyToOne(() => Usuario, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ManyToOne(() => Unidade, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'unidade_id' })
  unidade: Unidade;
}
