import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Condominio } from '../../facilities/entities/condominio.entity';
import { Unidade } from '../../facilities/entities/unidade.entity';
import { Usuario } from '../../iam/entities/usuario.entity';

export enum EntregaStatus {
  ATIVA = 'ATIVA',
  RECEBIDA = 'RECEBIDA',
  EXPIRADA = 'EXPIRADA',
  CANCELADA = 'CANCELADA',
}

@Entity('autorizacao_entrega')
export class AutorizacaoEntrega {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'condominio_id', type: 'uuid' })
  condominioId: string;

  @Column({ name: 'unidade_id', type: 'uuid' })
  unidadeId: string;

  @Column({ name: 'criado_por_usuario_id', type: 'uuid' })
  criadoPorUsuarioId: string;

  @Column({ type: 'varchar', length: 255 })
  descricao: string;

  @Column({ name: 'data_esperada', type: 'date' })
  dataEsperada: string;

  @Column({ name: 'janela_inicio', type: 'time', nullable: true })
  janelaInicio: string;

  @Column({ name: 'janela_fim', type: 'time', nullable: true })
  janelaFim: string;

  @Column({ type: 'enum', enum: EntregaStatus, default: EntregaStatus.ATIVA })
  status: EntregaStatus;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  // -- Timestamps --
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // -- Relacionamentos Inflexíveis DB-Level --
  @ManyToOne(() => Condominio, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'condominio_id' })
  condominio: Condominio;

  @ManyToOne(() => Unidade, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'unidade_id' })
  unidade: Unidade;

  @ManyToOne(() => Usuario, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'criado_por_usuario_id' })
  criador: Usuario;
}
