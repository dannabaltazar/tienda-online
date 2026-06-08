import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OrdenesService } from './ordenes.service';
import { CreateOrdenTargetDto } from './dto/create-orden.dto';
import { UpdateOrdenDto } from './dto/update-orden.dto';

@ApiTags('Órdenes')
@Controller('ordenes')
export class OrdenesController {
  constructor(private readonly ordenesService: OrdenesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una orden asociada a un cliente existente [cite: 140]' })
  create(@Body() createOrdenDto: CreateOrdenTargetDto) {
    return this.ordenesService.create(createOrdenDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las órdenes [cite: 140]' })
  findAll() {
    return this.ordenesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una orden por id con todos sus productos [cite: 140]' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordenesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar el estado de la orden [cite: 140]' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateOrdenDto: UpdateOrdenDto) {
    return this.ordenesService.update(id, updateOrdenDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una orden [cite: 140]' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ordenesService.remove(id);
  }
}