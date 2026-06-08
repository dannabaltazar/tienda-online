import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { Producto } from './entities/producto.entity';
import { Categoria } from '../categorias/entities/categoria.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Producto, Categoria])], // Agregamos Categoria aquí
  controllers: [ProductosController],
  providers: [ProductosService],
  exports: [TypeOrmModule],
})
export class ProductosModule {}