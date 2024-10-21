import migrationRunner from 'node-pg-migrate'
import { join } from 'node:path'

export default async function migrations(request, response) {
  if (request.method === 'GET') {
    console.log('Entrou no GET')
  }
  if (request.method === 'POST') {
    console.log('Entrou no POST')
  }

  const migration = await migrationRunner({
    databaseUrl: process.env.DATABASE_URL,
    dryRun: true,
    dir: join('infra', 'migrations'),
    direction: 'up',
    verbose: true,
    migrationsTable: 'pgmigrations',
  })
  response.status(200).json(migration)
}
