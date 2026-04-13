import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../entities/usuario.entity';

export class CreateUsuarioDto {
  @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  @IsUUID('4', { message: 'Condomínio ID precisa ser um UUID V4.' })
  condominioId: string;

  @ApiProperty({ example: 'João Silva' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  telefone?: string;

  @ApiProperty()
  @IsString()
  @MinLength(6, { message: 'A senha do morador ou funcionário precisa de no mínimo 6 dígitos.' })
  password: string;

  @ApiProperty({ enum: UserRole })
  @IsEnum(UserRole, { message: 'Role inválida. Precisa ser RESIDENT, PORTER ou ADMIN.' })
  role: UserRole;
}
