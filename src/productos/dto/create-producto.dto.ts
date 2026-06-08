import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateProductoDto {
  @ApiProperty({ example: 'Teclado Mecánico RGB' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nombre: string;

  @ApiProperty({ example: 'Teclado con switches red ideales para programar', required: false })
  @IsString()
  @IsOptional()
  descripcion?: string;

  @ApiProperty({ example: 450.50 })
  @IsNumber()
  @Min(0)
  precio: number;

  @ApiProperty({ example: 25 })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({ example: 1, description: 'ID de la categoría existente' })
  @IsNumber()
  @IsNotEmpty()
  idCategoria: number;
}