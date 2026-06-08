import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Cliente } from '../../clientes/entities/cliente.entity';
import { OrdenProducto } from '../../orden-producto/entities/orden-producto.entity';

@Entity('ordenes')
export class Orden {
  @PrimaryGeneratedColumn({ name: 'id_orden' })
  idOrden!: number;

  @Column({ type: 'varchar', length: 50, default: 'Pendiente' })
  estado!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total!: number;

  // CORREGIDO: Apunta correctamente a la propiedad 'ordenes' que tiene el Cliente
// ... otros imports
@ManyToOne(() => Cliente, (cliente) => cliente.ordenes, { onDelete: 'RESTRICT' })
@JoinColumn({ name: 'id_cliente' })
cliente!: Cliente;

  // Relación con los detalles de los productos incluidos
  @OneToMany(() => OrdenProducto, (ordenProducto) => ordenProducto.orden)
  detalles!: OrdenProducto[];

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn!: Date;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizadoEn!: Date;

  @DeleteDateColumn({ name: 'eliminado_en', nullable: true })
  eliminadoEn?: Date;
}