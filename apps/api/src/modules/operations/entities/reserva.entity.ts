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

export enum ReservaStatus {
  PENDENTE = 'PENDENTE',
  APROVADA = 'APROVADA',
  REJEITADA = 'REJEITADA',
  CANCELADA = 'CANCELADA',
}

@Entity('reserva')
@Check(`"fim" > "inicio"`)
export class Reserva {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'condominio_id', type: 'uuid' })
  condominioId: string;

  @Column({ name: 'unidade_id', type: 'uuid' })
  unidadeId: string;

  @Column({ name: 'criado_por_usuario_id', type: 'uuid' })
  criadoPorUsuarioId: string;

  @Column({ name: 'area_nome', type: 'varchar', length: 150 })
  areaNome: string;

  @Column({ name: 'data_reserva', type: 'date' })
  dataReserva: string;

  @Column({ type: 'time' })
  inicio: string;

  @Column({ type: 'time' })
  fim: string;

  @Column({ type: 'enum', enum: ReservaStatus, default: ReservaStatus.PENDENTE })
  status: ReservaStatus;

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
