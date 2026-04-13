/**
 * Seed Script - Cria dados iniciais para teste do MVP
 * Execute com: npx ts-node seed.ts
 */
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

const ds = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/condominio_db',
  entities: ['src/modules/**/entities/*.entity.ts'],
  synchronize: true,
  logging: false,
});

async function seed() {
  await ds.initialize();
  console.log('✅ Banco conectado');

  // 1. Condomínio
  const condoResult = await ds.query(`
    INSERT INTO condominio (nome, tipo, endereco)
    VALUES ('Residencial Primavera', 'HORIZONTAL', 'Rua das Flores, 100')
    ON CONFLICT DO NOTHING
    RETURNING id
  `);
  const condominioId = condoResult[0]?.id;
  if (!condominioId) {
    const existing = await ds.query(`SELECT id FROM condominio LIMIT 1`);
    console.log('ℹ️  Condomínio já existia:', existing[0]?.id);
    await ds.destroy();
    return;
  }
  console.log('🏢 Condomínio criado:', condominioId);

  // 2. Usuário Admin (Síndico)
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash('senha123', salt);
  await ds.query(`
    INSERT INTO usuario (condominio_id, nome, email, role, password_hash, status)
    VALUES ($1, 'Síndico Admin', 'admin@condo.com', 'ADMIN', $2, true)
    ON CONFLICT DO NOTHING
  `, [condominioId, hash]);
  console.log('👤 Admin criado: admin@condo.com / senha123');

  // 3. Usuário Porteiro
  const hashPort = await bcrypt.hash('senha123', salt);
  await ds.query(`
    INSERT INTO usuario (condominio_id, nome, email, role, password_hash, status)
    VALUES ($1, 'Porteiro João', 'porteiro@condo.com', 'PORTER', $2, true)
    ON CONFLICT DO NOTHING
  `, [condominioId, hashPort]);
  console.log('🚪 Porteiro criado: porteiro@condo.com / senha123');

  // 3.5. Usuário Morador
  const hashMorador = await bcrypt.hash('senha123', salt);
  await ds.query(`
    INSERT INTO usuario (condominio_id, nome, email, role, password_hash, status)
    VALUES ($1, 'Morador Teste', 'morador@condo.com', 'RESIDENT', $2, true)
    ON CONFLICT DO NOTHING
  `, [condominioId, hashMorador]);
  console.log('📱 Morador criado: morador@condo.com / senha123');

  // 4. Unidade de teste
  await ds.query(`
    INSERT INTO unidade (condominio_id, codigo, tipo)
    VALUES ($1, '101A', 'CASA')
    ON CONFLICT DO NOTHING
  `, [condominioId]);
  console.log('🏠 Unidade 101A criada');

  await ds.destroy();
  console.log('\n🎉 Seed concluído! Acesse http://localhost:5173 e faça login com admin@condo.com / senha123');
}

seed().catch(err => { console.error('❌ Erro no seed:', err.message); process.exit(1); });
