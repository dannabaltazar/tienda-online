import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdenesService } from './ordenes.service';
import { OrdenesController } from './ordenes.controller';
import { Orden } from './entities/orden.entity';
import { Cliente } from '../clientes/entities/cliente.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Orden, Cliente])],
  controllers: [OrdenesController],
  providers: [OrdenesService],
  exports: [TypeOrmModule],
})
export class OrdenesModule {}