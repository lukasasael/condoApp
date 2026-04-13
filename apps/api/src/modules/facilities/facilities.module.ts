import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Condominio } from './entities/condominio.entity';
import { Unidade } from './entities/unidade.entity';
import { MoradorUnidade } from './entities/morador-unidade.entity';
import { FacilitiesController } from './controllers/facilities.controller';
import { FacilitiesService } from './services/facilities.service';

@Module({
  imports: [TypeOrmModule.forFeature([Condominio, Unidade, MoradorUnidade])],
  controllers: [FacilitiesController],
  providers: [FacilitiesService],
  exports: [TypeOrmModule, FacilitiesService],
})
export class FacilitiesModule {}
