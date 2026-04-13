import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Condominio } from './condominio.entity';

@Entity('unidade')
@Unique(['condominioId', 'codigo', 'bloco']) // Regra extraída do artefato do banco
export class Unidade {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'condominio_id', type: 'uuid' })
  condominioId: string;

  @Column({ type: 'varchar', length: 50 })
  codigo: string; // Ex: Número do apartamento ou da casa

  @Column({ type: 'varchar', length: 50, nullable: true })
  bloco: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  tipo: string; // Ex: 'APARTAMENTO', 'CASA', 'LOTE'

  @Column({ type: 'boolean', default: true })
  status: boolean;

  // -- Timestamps e Auditoria --
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  // -- Relacionamentos --
  @ManyToOne(() => Condominio, (cond) => cond.unidades, {
    onDelete: 'RESTRICT', // Impede deletar condomínio se tiver unidades
  })
  @JoinColumn({ name: 'condominio_id' })
  condominio: Condominio;
}
