# SaintScale API

API REST para o aplicativo SaintScale — gerencia autenticacao, membros, escalas, musicas e avisos de igrejas.

Desenvolvida como parte do TCC da ETEC.

---

## Tecnologias

- **Hono** - framework web leve para TypeScript
- **@hono/node-server** - adaptador para rodar o Hono em Node.js
- **@hono/zod-openapi** - integracao entre validacao zod e documentacao OpenAPI
- **zod** - validacao de schemas e tipos
- **PostgreSQL** - banco de dados relacional
- **pg** (node-postgres) - cliente PostgreSQL para Node.js
- **argon2** - hashing de senhas (argon2id)
- **jose** - geracao e verificacao de JWT
- **Scalar** - interface interativa de documentacao da API
- **stoker** - utilitarios para Hono (middlewares de erro, helpers OpenAPI)
- **dotenv** - carregamento de variaveis de ambiente
- **tsx** - execucao de TypeScript diretamente em Node (para desenvolvimento)
- **TypeScript** - tipagem estatica
- **Biome** - linter e formatter
- **Docker** - ambiente de banco de dados local via docker-compose

---

## Estrutura do projeto

src/
  index.ts              Ponto de entrada - inicia o servidor HTTP
  app.ts                Monta o app principal e registra as rotas
  db/
    index.ts            Configura o Pool de conexoes com o PostgreSQL
    migrate.ts          Script para criar as tabelas (executa o tcc.sql)
    tcc.sql             Schema completo do banco de dados (DROP + CREATE)
  routes/
    api.ts              Agrega todos os sub-roteadores em /api/*
    auth/
      auth.index.ts     Monta as rotas de autenticacao
      auth.route.ts     Definicao da rota POST /login (schema OpenAPI)
      auth.handler.ts   Handler HTTP da rota de login
      auth.service.ts   Logica de negocio: verificar senha, gerar JWT
      auth.dao.ts       Query SQL: buscar usuario por email
      auth.jwt.ts       Funcao alternativa para criar token (nao utilizada)
    user/
      user.index.ts     Monta as rotas de usuario e aplica autenticacao
      user.route.ts     Definicao das rotas POST / e GET /
      user.handler.ts   Handlers HTTP para criar e listar usuarios
      user.dao.ts       Queries SQL: criar usuario, listar, buscar por email
  schemas/
    auth.schemas.ts     Schemas zod para login e resposta JWT
    user.schemas.ts     Schemas zod para usuario (criacao e listagem)
  middlewares/
    auth.middleware.ts  Middleware de autenticacao JWT
  tools/
    createAppRoute.ts   Funcoes createApp() e createRouter()
    configureApp.ts     Configura documentacao OpenAPI e Scalar
    types.ts            Tipo auxiliar App

---

## Rotas

### POST /api/auth/login

Autentica um membro existente e retorna um token JWT.

Nao requer autenticacao.

Corpo da requisicao:
  email    - string, email valido, max 100 caracteres
  password - string, minimo 8 caracteres, max 255

Resposta de sucesso (200):
  accessToken - string (JWT)
  tokenType   - "Bearer"

Resposta de erro (401):
  message - "Email ou senha invalidos"

---

### POST /api/user

Cria um novo membro.

Nao requer autenticacao (qualquer pessoa pode se cadastrar).

Corpo da requisicao:
  name       - string, max 150 caracteres
  birth_date - string, formato MM-DD-YYYY
  telephone  - string, max 11 caracteres (somente numeros)
  email      - string, email valido, max 255 caracteres
  password   - string, minimo 8 caracteres, max 60
  role       - string, max 60 caracteres

Resposta de sucesso (200): objeto do usuario criado (sem a senha em texto puro)

Observacao: o campo role enviado pelo cliente e ignorado pelo DAO — o cargo
sempre e salvo como "membro" para novos cadastros.

---

### GET /api/user

Lista todos os membros cadastrados.

Requer autenticacao (header Authorization: Bearer <token>).

Resposta de sucesso (200): array de objetos de usuario

---

## Autenticacao

### Login

A rota POST /api/auth/login:
1. Busca o usuario pelo email no banco (auth.dao.ts)
2. Verifica a senha com argon2.verify — compara a senha enviada com o hash salvo
3. Se valido, gera um JWT assinado com JWT_SECRET usando o algoritmo HS256
4. O JWT tem validade de 1 hora e contem: email, role, e sub (id do membro)
5. Retorna { accessToken, tokenType: "Bearer" }

### Verificacao do token (middleware)

O authMiddleware (middlewares/auth.middleware.ts):
1. Le o header Authorization da requisicao
2. Extrai o token do formato "Bearer <token>"
3. Chama jwtVerify (jose) para verificar a assinatura e a expiracao
4. Se valido, salva o payload no contexto (c.set("jwtPayload", payload))
5. Se invalido ou expirado, retorna 401

### Seguranca de senhas

As senhas sao salvas com argon2id — um algoritmo moderno resistente a ataques
de forca bruta. A senha em texto puro nunca e salva no banco.

---

## Banco de dados

O banco e PostgreSQL, acessado via Pool do node-postgres.

Tabelas principais:

- **membros** — cadastro de membros (nome, email, senha hash, cargo, data de nascimento, telefone)
- **musicas** — musicas do repertorio (nome, autor, tom, BPM, duracao, links)
- **escalas** — escalas de servico (data, descricao)
- **musicas_escalas** — relacionamento entre musicas e escalas (com tom especifico)
- **membros_escalas** — quais membros participam de cada escala e seu status
- **funcoes** — funcoes/cargos disponiveis (nome, permissoes)
- **avisos** — comunicados para os membros
- **funcoes_avisos** — quais funcoes recebem cada aviso
- **logradouro** — enderecos (para uso futuro)

Para criar as tabelas localmente, use o script de migracao (veja abaixo).

ATENCAO: O arquivo tcc.sql começa com DROP TABLE CASCADE em todas as tabelas.
Rodar a migracao vai apagar todos os dados existentes.

---

## Instalacao

npm install

---

## Rodando o projeto

# Desenvolvimento (com hot-reload)
npm run dev

# Build (compila TypeScript para JavaScript)
npm run build

# Producao (roda o JS compilado)
npm run start

---

## Banco local com Docker

Para rodar o banco de dados localmente:

docker-compose up -d

Isso sobe um PostgreSQL na porta 5432 com:
  usuario: postgres
  senha:   postgres
  banco:   saintscale

Depois, rode a migracao para criar as tabelas:

npx tsx src/db/migrate.ts

---

## Variaveis de ambiente

Crie um arquivo .env na raiz do projeto com:

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/saintscale
JWT_SECRET=sua_chave_secreta_aqui
PORT=3000

| Variavel     | Descricao                                         | Obrigatoria |
|--------------|---------------------------------------------------|-------------|
| DATABASE_URL | Connection string do PostgreSQL                   | Sim         |
| JWT_SECRET   | Chave secreta para assinar e verificar os JWTs    | Sim         |
| PORT         | Porta do servidor (padrao: 3000)                  | Nao         |

---

## Documentacao da API

Com o servidor rodando, acesse:

http://localhost:3000/scalar   - Interface interativa (Scalar)
http://localhost:3000/doc      - Schema OpenAPI em JSON

A documentacao e gerada automaticamente a partir dos schemas zod definidos nas rotas.

---

## Notas importantes

- O CORS esta configurado para aceitar apenas http://localhost:8081 (porta padrao do Expo).
  Em producao, isso precisa ser ajustado para aceitar a origem do app deployado.
- O arquivo auth.jwt.ts define uma funcao createAccessToken que nunca e importada
  ou usada. A geracao de tokens acontece em auth.service.ts.
- A funcao getUserByEmail no user.dao.ts esta definida mas nao e chamada por nenhuma rota.
- O tipo do id_member no schema do backend e INTEGER, mas o schema do frontend espera UUID.
  Isso causa incompatibilidade ao validar respostas da API no frontend.