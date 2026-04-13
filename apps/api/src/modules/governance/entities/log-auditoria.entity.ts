import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Condominio } from '../../facilities/entities/condominio.entity';
import { Usuario } from '../../iam/entities/usuario.entity';

@Entity('log_auditoria')
export class LogAuditoria {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'condominio_id', type: 'uuid' })
  condominioId: string;

  @Column({ name: 'ator_usuario_id', type: 'uuid', nullable: true })
  atorUsuarioId: string; // Pode ser null se a ação foi o sistema disparando cronjob ou auth inicial

  @Column({ type: 'varchar', length: 255 })
  acao: string;

  @Column({ name: 'entidade_tipo', type: 'varchar', length: 150 })
  entidadeTipo: string;

  @Column({ name: 'entidade_id', type: 'uuid' })
  entidadeId: string;

  @Column({ name: 'contexto_json', type: 'jsonb', nullable: true })
  contextoJson: object;

  @Column({ name: 'criado_em', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  criadoEm: Date;

  // -- Relacionamentos (Log Imutável e Inflexível) --
  @ManyToOne(() => Condominio, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'condominio_id' })
  condominio: Condominio;

  @ManyToOne(() => Usuario, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'ator_usuario_id' })
  ator: Usuario;
}
