import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Orden } from '../../ordenes/entities/orden.entity';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn({ name: 'id_cliente' })
  idCliente!: number;

  @Column({ type: 'varchar', length: 100 })
  nombres!: string;

  @Column({ type: 'varchar', length: 100 })
  paterno!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  materno?: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  email!: string;

  // CORREGIDO: Apunta a (orden) => orden.cliente
  @OneToMany(() => Orden, (orden) => orden.cliente)
  ordenes!: Orden[];

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn!: Date;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizadoEn!: Date;

  @DeleteDateColumn({ name: 'eliminado_en', nullable: true })
  eliminadoEn?: Date;
}