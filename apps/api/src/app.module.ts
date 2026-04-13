import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Domínios
import { IamModule } from './modules/iam/iam.module';
import { FacilitiesModule } from './modules/facilities/facilities.module';
import { OperationsModule } from './modules/operations/operations.module';
import { GovernanceModule } from './modules/governance/governance.module';

// Core
import { AuditInterceptor } from './core/interceptors/audit.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Carrega o .env globalmente
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/condominio_db',
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production', // [AVISO]: Usado apenas no desenvolvimento! No futuro usaremos Migrations formais.
      logging: false,
    }),
    IamModule,
    FacilitiesModule,
    OperationsModule,
    GovernanceModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR, // Injeta o Auditing de forma global com escopo da Injeção de Dependências
      useClass: AuditInterceptor,
    },
  ],
})
export class AppModule {}

