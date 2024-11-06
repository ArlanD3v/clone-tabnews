import { Client } from 'pg'

async function query(queryObject) {
  let client
  try {
    client = await getNewClient()
    const result = await client.query(queryObject)
    return result
  } catch (error) {
    console.log(error)
    throw error
  } finally {
    await client.end()
  }
}
async function getNewClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSSLValues(),
  })
  await client.connect()
  return client
}

export default {
  query,
  getNewClient,
}

function getSSLValues() {
  // Verifica se o ambiente é de produção
  if (process.env.NODE_ENV === 'production') {
    if (process.env.POSTGRES_CA) {
      return {
        ca: process.env.POSTGRES_CA,
        rejectUnauthorized: true,
      }
    }
    return { rejectUnauthorized: true } // SSL ativado sem CA se necessário
  }
  // Em ambientes não-produção, desabilita SSL
  return false
}
//16:25
