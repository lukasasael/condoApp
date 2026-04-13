import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin@condominio.com', description: 'Obrigatório o vínculo via tenant interno' })
  @IsEmail({}, { message: 'Precisa ser um formato de email válido.' })
  email: string;

  @ApiProperty({ example: 'senha123', description: 'Senha de acesso' })
  @IsString()
  @IsNotEmpty({ message: 'A senha não pode estar em branco.' })
  password: string;
}
