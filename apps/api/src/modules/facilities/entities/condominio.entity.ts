import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { Unidade } from '../../facilities/entities/unidade.entity';
import { Usuario } from '../../iam/entities/usuario.entity';

@Entity('condominio')
export class Condominio {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150 })
  nome: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  tipo: string; // Ex: 'HORIZONTAL', 'VERTICAL'

  @Column({ type: 'varchar', length: 255, nullable: true })
  endereco: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  cidade: string;

  @Column({ type: 'varchar', length: 2, nullable: true })
  estado: string;

  @Column({ type: 'boolean', default: true })
  ativo: boolean;

  // -- Timestamps e Auditoria --
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  // -- Relacionamentos Inversos --
  @OneToMany(() => Unidade, (unidade) => unidade.condominio)
  unidades: Unidade[];

  @OneToMany(() => Usuario, (usuario) => usuario.condominio)
  usuarios: Usuario[];
}
