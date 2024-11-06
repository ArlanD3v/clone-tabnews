import { Client } from 'pg'
// Importa o módulo 'Client' da biblioteca 'pg' (node-postgres), que é usado para conectar e interagir com o banco de dados PostgreSQL

async function query(queryObject) {
  // Define uma função assíncrona 'query' que recebe um objeto de consulta (queryObject)

  let client
  // Declara uma variável 'client' que será usada para armazenar a instância de conexão com o banco de dados

  try {
    client = await getNewClient()
    // Tenta obter uma nova instância de conexão com o banco chamando 'getNewClient()' (função que deve retornar uma nova conexão)

    const result = await client.query(queryObject)
    // Executa a consulta no banco de dados usando 'client.query(queryObject)' e armazena o resultado na variável 'result'

    return result
    // Retorna o resultado da consulta para quem chamou a função
  } catch (error) {
    console.log(error)
    // Em caso de erro, exibe o erro no console para facilitar a depuração

    throw error
    // Lança o erro novamente para que ele possa ser tratado em outro lugar, caso necessário
  } finally {
    await client.end()
    // No final, independentemente de erro ou sucesso, encerra a conexão com o banco de dados para liberar os recursos
  }
}

async function getNewClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSSLValues(), //Função definida abaixo
  })
  await client.connect()
  return client
}

function getSSLValues() {
  // Função que determina os valores de SSL com base no ambiente e nas variáveis de ambiente

  if (process.env.NODE_ENV === 'production') {
    // Verifica se o ambiente é de produção, caso contrário, SSL não é necessário

    console.log('Ambiente ', process.env.NODE_ENV)
    // Exibe no console qual é o ambiente atual, para fins de depuração

    if (process.env.POSTGRES_CA) {
      // Verifica se a variável de ambiente 'POSTGRES_CA' está definida
      // Essa variável geralmente contém o certificado da autoridade certificadora (CA) para SSL

      return {
        ca: process.env.POSTGRES_CA,
        // Define o certificado CA a partir da variável de ambiente contida dentro do .env.development

        rejectUnauthorized: true,
        // Configura a conexão para rejeitar certificados não autorizados,
        // o que é importante em produção para garantir segurança
      }
    }
  }

  console.log('Ambiente ', process.env.NODE_ENV)
  // Exibe o ambiente no console (caso não seja produção ou POSTGRES_CA não esteja definido)

  return false
  // Retorna 'false', desativando SSL quando não está em produção ou 'POSTGRES_CA' não está configurado
}

export default {
  query,
  getNewClient,
}

//16:25
