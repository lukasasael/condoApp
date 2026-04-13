import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutorizacaoVisita } from './entities/autorizacao-visita.entity';
import { AutorizacaoEntrega } from './entities/autorizacao-entrega.entity';
import { Reserva } from './entities/reserva.entity';
import { Ocorrencia } from './entities/ocorrencia.entity';
import { OperationsController } from './controllers/operations.controller';
import { OperationsService } from './services/operations.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AutorizacaoVisita,
      AutorizacaoEntrega,
      Reserva,
      Ocorrencia,
    ]),
  ],
  controllers: [OperationsController],
  providers: [OperationsService],
  exports: [TypeOrmModule, OperationsService],
})
export class OperationsModule {}
