import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comunicado } from './entities/comunicado.entity';
import { LogAuditoria } from './entities/log-auditoria.entity';
import { GovernanceController } from './controllers/governance.controller';
import { GovernanceService } from './services/governance.service';

@Module({
  imports: [TypeOrmModule.forFeature([Comunicado, LogAuditoria])],
  controllers: [GovernanceController],
  providers: [GovernanceService],
  exports: [TypeOrmModule, GovernanceService],
})
export class GovernanceModule {}
