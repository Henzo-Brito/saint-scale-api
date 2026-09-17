// Configuração da conexão com o banco de dados PostgreSQL.
//
// O "pg" é a biblioteca oficial do Node.js para se comunicar com o PostgreSQL.
// O Pool é uma forma inteligente de gerenciar conexões: em vez de abrir e
// fechar uma conexão nova a cada query, o Pool mantém um conjunto de conexões
// abertas que são reutilizadas. Isso melhora a performance da API.

import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

// A connection string contém todas as informações necessárias para se conectar
// ao banco: host, usuário, senha, nome do banco e porta.
// Ela fica na variável de ambiente DATABASE_URL para não expor esses dados
// no código-fonte (que poderia ser publicado no GitHub).
//
// Exemplo de DATABASE_URL:
//   postgresql://usuario:senha@host:5432/nome_do_banco
export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        // rejectUnauthorized: false permite conectar em servidores SSL
        // com certificado autoassinado (comum em bancos gratuitos como o Render).
        // Em produção com banco próprio, o ideal seria true.
        rejectUnauthorized: false,
    },
});
