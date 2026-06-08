import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Orden } from './entities/orden.entity';
import { CreateOrdenTargetDto } from './dto/create-orden.dto';
import { UpdateOrdenDto } from './dto/update-orden.dto';
import { Cliente } from '../clientes/entities/cliente.entity';

@Injectable()
export class OrdenesService {
  constructor(
    @InjectRepository(Orden)
    private readonly ordenRepository: Repository<Orden>, // <-- Cada uno con su decorador independiente

    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>, // <-- Cada uno con su decorador independiente
  ) {}

  async create(createOrdenDto: CreateOrdenTargetDto): Promise<Orden> {
    const { idCliente, estado } = createOrdenDto;
    
    const cliente = await this.clienteRepository.findOne({ 
      where: { idCliente: idCliente } 
    });
    
    if (!cliente) {
      throw new NotFoundException(`El cliente con ID ${idCliente} no existe.`);
    }

    const nuevaOrden = this.ordenRepository.create({
      cliente: cliente,
      estado: estado,
      total: 0,
    });
    
    return await this.ordenRepository.save(nuevaOrden);
  }

  async findAll(): Promise<Orden[]> {
    return await this.ordenRepository.find({
      relations: {
        cliente: true,
        detalles: true,
      },
    });
  }

  async findOne(id: number): Promise<Orden> {
    const orden = await this.ordenRepository.findOne({
      where: { idOrden: id },
      relations: {
        cliente: true,
        detalles: {
          producto: true,
        },
      },
    });
    
    if (!orden) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada.`);
    }
    return orden;
  }

  async update(id: number, updateOrdenDto: UpdateOrdenDto): Promise<Orden> {
    const orden = await this.findOne(id);
    Object.assign(orden, updateOrdenDto);
    return await this.ordenRepository.save(orden);
  }

  async remove(id: number): Promise<{ message: string }> {
    const orden = await this.findOne(id);
    await this.ordenRepository.softRemove(orden);
    return { message: `Orden ${id} eliminada correctamente` };
  }
}