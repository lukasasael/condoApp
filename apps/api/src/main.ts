import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './core/filters/global-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilita CORS para o Monorepo (Portaria e Síndico se conectarem)
  app.enableCors();

  // Pipe Universal de Validações (Protege payload pollution)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove propriedades que não estão no DTO
      forbidNonWhitelisted: true, // Dá erro se mandar coisa sobrando
      transform: true, // Converte tipos automaticamente (ex: id url de string pra int/uuid)
    }),
  );

  // Filtro de Exceções padronizado
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Prefixo da API (versionamento padrão de mercado)
  app.setGlobalPrefix('api/v1');

  // Configuração do Swagger OpenAPI
  const config = new DocumentBuilder()
    .setTitle('Condominio Platform API')
    .setDescription('API central operacional do condomínio (MVP)')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document);

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
