import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Check,
} from 'typeorm';
import { Condominio } from '../../facilities/entities/condominio.entity';
import { Unidade } from '../../facilities/entities/unidade.entity';
import { Usuario } from '../../iam/entities/usuario.entity';

export enum OcorrenciaStatus {
  ABERTA = 'ABERTA',
  RESOLVIDA = 'RESOLVIDA',
}

export enum OcorrenciaOrigem {
  PORTARIA = 'PORTARIA',
  ADMINISTRACAO = 'ADMINISTRACAO',
  RECLAMACAO = 'RECLAMACAO',
}

@Entity('ocorrencia')
@Check(`("status" = 'RESOLVIDA' AND "resolvido_em" IS NOT NULL AND "resolvido_por_usuario_id" IS NOT NULL) OR ("status" = 'ABERTA' AND "resolvido_em" IS NULL AND "resolvido_por_usuario_id" IS NULL)`) // Validação cruzada estrita do model validator
export class Ocorrencia {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'condominio_id', type: 'uuid' })
  condominioId: string;

  @Column({ name: 'unidade_id', type: 'uuid', nullable: true })
  unidadeId: string;

  @Column({ name: 'criado_por_usuario_id', type: 'uuid' })
  criadoPorUsuarioId: string;

  @Column({ name: 'resolvido_por_usuario_id', type: 'uuid', nullable: true })
  resolvidoPorUsuarioId: string;

  @Column({ type: 'varchar', length: 100 })
  categoria: string;

  @Column({ type: 'text' })
  descricao: string;

  @Column({ type: 'enum', enum: OcorrenciaStatus, default: OcorrenciaStatus.ABERTA })
  status: OcorrenciaStatus;

  @Column({ type: 'enum', enum: OcorrenciaOrigem })
  origem: OcorrenciaOrigem;

  @Column({ name: 'criado_em', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  criadoEm: Date;

  @Column({ name: 'resolvido_em', type: 'timestamp', nullable: true })
  resolvidoEm: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // -- Relacionamentos Inflexíveis --
  @ManyToOne(() => Condominio, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'condominio_id' })
  condominio: Condominio;

  @ManyToOne(() => Unidade, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'unidade_id' })
  unidade: Unidade;

  @ManyToOne(() => Usuario, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'criado_por_usuario_id' })
  criador: Usuario;

  @ManyToOne(() => Usuario, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'resolvido_por_usuario_id' })
  resolutor: Usuario;
}
