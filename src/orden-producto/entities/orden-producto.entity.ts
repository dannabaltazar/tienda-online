import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Orden } from '../../ordenes/entities/orden.entity';
import { Producto } from '../../productos/entities/producto.entity';

@Entity('orden_producto')
export class OrdenProducto {
  @PrimaryGeneratedColumn({ name: 'id_orden_producto' })
  idOrdenProducto!: number;

  @Column({ type: 'int' })
  cantidad!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precioUnitario!: number;

  // Relación con Ordenes
  @ManyToOne(() => Orden, (orden) => orden.detalles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_orden' })
  orden!: Orden;

  // Relación con Productos
  @ManyToOne(() => Producto, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'id_producto' })
  producto!: Producto;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn!: Date;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizadoEn!: Date;

  @DeleteDateColumn({ name: 'eliminado_en', nullable: true })
  eliminadoEn?: Date;
}