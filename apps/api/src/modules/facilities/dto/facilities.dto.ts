import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCondominioDto {
  @ApiProperty({ example: 'Condomínio Residencial Primavera' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiPropertyOptional({ example: 'VERTICAL' })
  @IsString()
  @IsOptional()
  tipo?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  endereco?: string;
}

export class CreateUnidadeDto {
  @ApiProperty({ example: 'd47ac10b-58cc-4372-a567-0e02b2c3d479' })
  @IsUUID('4')
  condominioId: string;

  @ApiProperty({ example: '101A' })
  @IsString()
  @IsNotEmpty()
  codigo: string;

  @ApiPropertyOptional({ example: 'Bloco B' })
  @IsString()
  @IsOptional()
  bloco?: string;

  @ApiPropertyOptional({ example: 'APARTAMENTO' })
  @IsString()
  @IsOptional()
  tipo?: string;
}
