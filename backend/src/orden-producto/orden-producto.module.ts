import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdenProductoService } from './orden-producto.service';
import { OrdenProductoController } from './orden-producto.controller';
import { OrdenProducto } from './entities/orden-producto.entity';
import { Orden } from '../ordenes/entities/orden.entity';
import { Producto } from '../productos/entities/producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrdenProducto, Orden, Producto])],
  controllers: [OrdenProductoController],
  providers: [OrdenProductoService],
})
export class OrdenProductoModule {}