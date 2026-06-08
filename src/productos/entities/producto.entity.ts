import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Categoria } from '../../categorias/entities/categoria.entity';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn({ name: 'id_producto' })
  idProducto!: number;

  @Column({ type: 'varchar', length: 150 })
  nombre!: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio!: number;

  @Column({ type: 'int' })
  stock!: number;

  // NUEVO: Relación N:1 apuntando a la categoría. Usamos RESTRICT para que no se borre una categoría con productos.
  @ManyToOne(() => Categoria, (categoria) => categoria.productos, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'id_categoria' })
  categoria!: Categoria;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn!: Date;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizadoEn!: Date;

  @DeleteDateColumn({ name: 'eliminado_en', nullable: true })
  eliminadoEn?: Date;
}