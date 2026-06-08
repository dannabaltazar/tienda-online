import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateOrdenTargetDto {
  @ApiProperty({ example: 1, description: 'ID del Cliente que realiza la orden' })
  @IsNumber()
  @IsNotEmpty()
  idCliente!: number;

  @ApiProperty({ example: 'Pendiente', required: false })
  @IsString()
  @IsOptional()
  estado?: string;
}