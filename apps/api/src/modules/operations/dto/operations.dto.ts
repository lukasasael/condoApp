import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OcorrenciaOrigem } from '../entities/ocorrencia.entity';

export class CreateVisitaDto {
  @ApiProperty({ example: 'b47ac10b-58cc-4372-a567-0e02b2c3d479' })
  @IsUUID('4')
  unidadeId: string;

  @ApiProperty({ example: 'João Visitante' })
  @IsString()
  @IsNotEmpty()
  nomeVisitante: string;

  @ApiProperty({ example: '2026-05-10' })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Data deve ser YYYY-MM-DD' })
  dataVisita: string;

  @ApiProperty({ example: '14:00:00' })
  @IsString()
  @Matches(/^\d{2}:\d{2}(:\d{2})?$/, { message: 'Janela de inicio deve ser HH:mm ou HH:mm:ss' })
  janelaInicio: string;

  @ApiProperty({ example: '18:00:00' })
  @IsString()
  @Matches(/^\d{2}:\d{2}(:\d{2})?$/, { message: 'Janela de fim deve ser HH:mm ou HH:mm:ss' })
  janelaFim: string;
}

export class CreateOcorrenciaDto {
  @ApiPropertyOptional()
  @IsUUID('4')
  @IsOptional()
  unidadeId?: string;

  @ApiProperty({ example: 'Barulho' })
  @IsString()
  @IsNotEmpty()
  categoria: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  descricao: string;

  @ApiProperty({ enum: OcorrenciaOrigem })
  @IsEnum(OcorrenciaOrigem)
  origem: OcorrenciaOrigem;
}

export class CreateReservaDto {
  @ApiProperty()
  @IsUUID('4')
  unidadeId: string;

  @ApiProperty({ example: 'Salão de Festas' })
  @IsString()
  @IsNotEmpty()
  areaNome: string;

  @ApiProperty({ example: '2026-05-15' })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  dataReserva: string;

  @ApiProperty({ example: '10:00:00' })
  @IsString()
  @Matches(/^\d{2}:\d{2}(:\d{2})?$/)
  inicio: string;

  @ApiProperty({ example: '14:00:00' })
  @IsString()
  @Matches(/^\d{2}:\d{2}(:\d{2})?$/)
  fim: string;
}
