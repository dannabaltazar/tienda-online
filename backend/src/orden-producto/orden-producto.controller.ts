import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { OrdenProductoService } from './orden-producto.service';
import { CreateOrdenProductoDto } from './dto/create-orden-producto.dto';

@ApiTags('Orden-Producto (Detalles)') 
@Controller('orden-producto')
export class OrdenProductoController {
  constructor(private readonly ordenProductoService: OrdenProductoService) {}

  @Post()
  @ApiOperation({ summary: 'Añadir un producto a una orden [cite: 148]' })
  create(@Body() createOrdenProductoDto: CreateOrdenProductoDto) {
    return this.ordenProductoService.create(createOrdenProductoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los detalles registrados [cite: 152]' })
  findAll() {
    return this.ordenProductoService.findAll();
  }

  @Delete(':orderId/productos/:productId')
  @ApiOperation({ summary: 'Quitar un producto de la orden restableciendo el stock [cite: 155, 158]' })
  remove(@Param('orderId', ParseIntPipe) orderId: number, @Param('productId', ParseIntPipe) productId: number) {
    return this.ordenProductoService.remove(orderId, productId);
  }
}