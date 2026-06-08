import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Categoria } from '../categorias/entities/categoria.entity';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,

    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>, // <-- CORREGIDO: Quitamos el Repository duplicado aquí
  ) {}

  async create(createProductoDto: CreateProductoDto): Promise<Producto> {
    const { idCategoria, ...datosProducto } = createProductoDto;

    // Buscar si la categoría existe
    const categoria = await this.categoriaRepository.findOne({ 
      where: { idCategoria: idCategoria } 
    });
    
    if (!categoria) {
      throw new NotFoundException(`La categoría con ID ${idCategoria} no existe. No se puede crear el producto.`);
    }

    // Instanciar el producto asociándole el objeto completo de la categoría
    const nuevoProducto = this.productoRepository.create({
      ...datosProducto,
      categoria: categoria,
    });

    return await this.productoRepository.save(nuevoProducto);
  }

  async findAll(): Promise<Producto[]> {
    // Carga la relación 'categoria' de manera estricta
    return await this.productoRepository.find({
      relations: {
        categoria: true,
      },
    });
  }

  async findOne(id: number): Promise<Producto> {
    const producto = await this.productoRepository.findOne({
      where: { idProducto: id },
      relations: {
        categoria: true,
      },
    });
    
    if (!producto) {
      throw new NotFoundException(`El producto con ID ${id} no existe`);
    }
    return producto;
  }

  async update(id: number, updateProductoDto: UpdateProductoDto): Promise<Producto> {
    const producto = await this.findOne(id);
    const { idCategoria, ...datosAEditar } = updateProductoDto;

    if (idCategoria) {
      const categoria = await this.categoriaRepository.findOne({ 
        where: { idCategoria: idCategoria } 
      });
      
      if (!categoria) {
        throw new NotFoundException(`La categoría con ID ${idCategoria} no existe`);
      }
      producto.categoria = categoria;
    }

    Object.assign(producto, datosAEditar);
    return await this.productoRepository.save(producto);
  }

  async remove(id: number): Promise<{ message: string }> {
    const producto = await this.findOne(id);
    await this.productoRepository.softRemove(producto);
    return { message: `Producto con ID ${id} eliminado correctamente` };
  }
}