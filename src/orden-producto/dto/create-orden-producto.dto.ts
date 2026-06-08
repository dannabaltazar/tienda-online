import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateOrdenProductoDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  idOrden!: number;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @IsNotEmpty()
  idProducto!: number;

  @ApiProperty({ example: 3 })
  @IsNumber()
  @Min(1)
  cantidad!: number;
}