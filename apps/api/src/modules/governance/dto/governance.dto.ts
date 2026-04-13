import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateComunicadoDto {
  @ApiProperty({ example: 'Manutenção da Piscina' })
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @ApiProperty({ example: 'Informamos que a piscina central passará por manutenção preventiva.' })
  @IsString()
  @IsNotEmpty()
  conteudo: string;
}
