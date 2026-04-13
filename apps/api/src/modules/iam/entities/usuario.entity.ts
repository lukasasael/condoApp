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
import { Condominio } from '../../facilities/entities/condominio.entity';

export enum UserRole {
  ADMIN = 'ADMIN',
  PORTER = 'PORTER',
  RESIDENT = 'RESIDENT',
}

@Entity('usuario')
@Unique(['email', 'condominioId']) // Permite o mesmo email em edifícios separados
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'condominio_id', type: 'uuid' })
  condominioId: string;

  @Column({ type: 'varchar', length: 200 })
  nome: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefone: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.RESIDENT })
  role: UserRole;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @Column({ name: 'ultimo_login_em', type: 'timestamp', nullable: true })
  ultimoLoginEm: Date;

  // -- Timestamps e Auditoria --
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  // -- Relacionamentos --
  @ManyToOne(() => Condominio, (cond) => cond.usuarios, {
    onDelete: 'RESTRICT', // Integridade Rígida
  })
  @JoinColumn({ name: 'condominio_id' })
  condominio: Condominio;
}
