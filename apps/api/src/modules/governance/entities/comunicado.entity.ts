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
import { Usuario } from '../../iam/entities/usuario.entity';

@Entity('comunicado')
export class Comunicado {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'condominio_id', type: 'uuid' })
  condominioId: string;

  @Column({ name: 'autor_usuario_id', type: 'uuid' })
  autorUsuarioId: string;

  @Column({ type: 'varchar', length: 255 })
  titulo: string;

  @Column({ type: 'text' })
  conteudo: string;

  @Column({ name: 'publicado_em', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  publicadoEm: Date;

  @Column({ type: 'boolean', default: true })
  ativo: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // -- Relacionamentos Inflexíveis DB-Level --
  @ManyToOne(() => Condominio, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'condominio_id' })
  condominio: Condominio;

  @ManyToOne(() => Usuario, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'autor_usuario_id' })
  autor: Usuario;
}
