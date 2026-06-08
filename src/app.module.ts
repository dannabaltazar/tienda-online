import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Módulos
import { CategoriasModule } from './categorias/categorias.module';
import { ClientesModule } from './clientes/clientes.module';
import { ProductosModule } from './productos/productos.module';
import { OrdenesModule } from './ordenes/ordenes.module'; 
import { OrdenProductoModule } from './orden-producto/orden-producto.module'; 

// Entidades
import { Categoria } from './categorias/entities/categoria.entity';
import { Cliente } from './clientes/entities/cliente.entity';
import { Producto } from './productos/entities/producto.entity';
import { Orden } from './ordenes/entities/orden.entity'; 
import { OrdenProducto } from './orden-producto/entities/orden-producto.entity'; 

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', // <-- Requerido por la práctica
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME, // <-- Leerá dinámicamente tu BD de producción o local
      entities: [Categoria, Cliente, Producto, Orden, OrdenProducto],
      synchronize: true, // <-- El PDF exige explícitamente que sea true de manera directa
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    }),
    CategoriasModule,
    ClientesModule,
    ProductosModule,
    OrdenesModule,
    OrdenProductoModule,
  ],
})
export class AppModule {}