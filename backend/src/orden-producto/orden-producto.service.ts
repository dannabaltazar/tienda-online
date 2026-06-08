import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrdenProducto } from './entities/orden-producto.entity';
import { CreateOrdenProductoDto } from './dto/create-orden-producto.dto';
import { Orden } from '../ordenes/entities/orden.entity';
import { Producto } from '../productos/entities/producto.entity';

@Injectable()
export class OrdenProductoService {
  constructor(
    @InjectRepository(OrdenProducto)
    private readonly opRepository: Repository<OrdenProducto>,

    @InjectRepository(Orden)
    private readonly ordenRepository: Repository<Orden>,

    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) {}

  async create(dto: CreateOrdenProductoDto): Promise<OrdenProducto> {
    const orden = await this.ordenRepository.findOne({ 
      where: { idOrden: dto.idOrden }, 
      relations: { detalles: true } 
    });
    if (!orden) throw new NotFoundException('Orden no encontrada');

    const producto = await this.productoRepository.findOne({ 
      where: { idProducto: dto.idProducto } 
    });
    if (!producto) throw new NotFoundException('Producto no encontrado');

    if (producto.stock < dto.cantidad) {
      throw new BadRequestException(`Stock insuficiente. Solo quedan ${producto.stock} unidades.`);
    }

    // Descontar Stock del producto
    producto.stock -= dto.cantidad;
    await this.productoRepository.save(producto);

    const detalle = this.opRepository.create({
      orden: orden,
      producto: producto,
      cantidad: dto.cantidad,
      precioUnitario: producto.precio,
    });

    const guardado = await this.opRepository.save(detalle);
    await this.recalcularTotalOrden(orden.idOrden);
    return guardado;
  }

  async findAll() {
    return await this.opRepository.find({ 
      relations: { orden: true, producto: true } 
    });
  }

  async findOne(id: number) {
    const registro = await this.opRepository.findOne({ 
      where: { idOrdenProducto: id }, 
      relations: { orden: true, producto: true } 
    });
    if (!registro) throw new NotFoundException('Registro no encontrado');
    return registro;
  }

  async remove(idOrden: number, idProducto: number) {
    const registro = await this.opRepository.findOne({
      where: { 
        orden: { idOrden: idOrden }, 
        producto: { idProducto: idProducto } 
      },
      relations: { producto: true }
    });
    if (!registro) throw new NotFoundException('El producto no está en esta orden');

    // Devolver el stock
    registro.producto.stock += registro.cantidad;
    await this.productoRepository.save(registro.producto);

    await this.opRepository.remove(registro);
    await this.recalcularTotalOrden(idOrden);

    return { message: 'Producto retirado de la orden y stock restaurado' };
  }

  private async recalcularTotalOrden(idOrden: number) {
    const orden = await this.ordenRepository.findOne({ 
      where: { idOrden: idOrden }, 
      relations: { detalles: true } 
    });
    if (orden) {
      orden.total = orden.detalles.reduce((acc, item) => acc + Number(item.cantidad) * Number(item.precioUnitario), 0);
      await this.ordenRepository.save(orden);
    }
  }
}