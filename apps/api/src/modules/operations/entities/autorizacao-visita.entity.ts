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

export enum VisitaStatus {
  ATIVA = 'ATIVA',
  UTILIZADA = 'UTILIZADA',
  EXPIRADA = 'EXPIRADA',
  CANCELADA = 'CANCELADA',
}

@Entity('autorizacao_visita')
export class AutorizacaoVisita {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'condominio_id', type: 'uuid' })
  condominioId: string;

  @Column({ name: 'unidade_id', type: 'uuid' })
  unidadeId: string;

  @Column({ name: 'criado_por_usuario_id', type: 'uuid' })
  criadoPorUsuarioId: string;

  @Column({ name: 'nome_visitante', type: 'varchar', length: 150 })
  nomeVisitante: string;

  @Column({ name: 'documento_visitante', type: 'varchar', length: 50, nullable: true })
  documentoVisitante: string;

  @Column({ name: 'data_visita', type: 'date' })
  dataVisita: string;

  @Column({ name: 'janela_inicio', type: 'time' })
  janelaInicio: string;

  @Column({ name: 'janela_fim', type: 'time' })
  janelaFim: string;

  @Column({ name: 'tipo_acesso', type: 'varchar', length: 50, nullable: true })
  tipoAcesso: string;

  @Column({ type: 'enum', enum: VisitaStatus, default: VisitaStatus.ATIVA })
  status: VisitaStatus;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @Column({ name: 'cancelado_em', type: 'timestamp', nullable: true })
  canceladoEm: Date;

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
