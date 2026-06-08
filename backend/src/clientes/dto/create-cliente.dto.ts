import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateClienteDto {
  @ApiProperty({ example: 'Juan' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombres: string;

  @ApiProperty({ example: 'Pérez' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  paterno: string;

  @ApiProperty({ example: 'Mamani', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  materno?: string;

  @ApiProperty({ example: 'juan.perez@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(150)
  email: string;
}