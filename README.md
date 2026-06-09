# 🧪 Testes automatizados: https://github.com/rebvisconti/petcare-sql-tests

# 🐾 PetCare SQL QA
![Node.js](https://img.shields.io/badge/Node.js-backend-339933?logo=node.js&logoColor=white&style=for-the-badge)
![SQLite](https://img.shields.io/badge/SQLite-database-003B57?logo=sqlite&logoColor=white&style=for-the-badge)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black&style=for-the-badge)
![SQL](https://img.shields.io/badge/SQL-queries-blue?style=for-the-badge)
![API](https://img.shields.io/badge/API-REST-informational?style=for-the-badge)
![Tests](https://img.shields.io/badge/testing-QA%20focused-success?style=for-the-badge)
![Database](https://img.shields.io/badge/database-real%20data-important?style=for-the-badge)
![Practice](https://img.shields.io/badge/purpose-hands--on%20lab-blueviolet?style=for-the-badge)

API REST + banco de dados SQLite + frontend do PetCare — tudo em um único servidor Node.js.

Desenvolvido para **prática de automação de testes** com Playwright, Cypress, Postman, Bruno e validações SQL.

✅ Este é o repositório principal do ecossistema PetCare.
Com apenas um `npm start`, o frontend, a API e o banco de dados ficam disponíveis para testes.

---

## 🎯 Objetivo do Projeto

Este projeto foi desenvolvido para simular um ambiente real de testes, permitindo:

- Testes de API REST com dados persistentes
- Validação de dados diretamente no banco SQLite
- Testes End-to-End envolvendo frontend, API e banco
- Criação de automações com Playwright, Cypress ou Robot Framework
- Prática de consultas SQL aplicadas ao contexto de QA
- Execução de cenários completos de CRUD e regras de negócio

---

## ✨ O que roda neste projeto

- **Frontend completo** — login, CRUD de agendamentos, filtros (servido via `express.static`)
- **API REST** — todos os endpoints documentados via Swagger UI
- **Banco SQLite real** — dados persistem entre restarts
- **Logs estruturados** — Winston com arquivos `logs/app.log` e `logs/error.log`

---

## 🛠️ Tecnologias

- Node.js, Express, CORS
- `better-sqlite3` — banco SQLite síncrono
- Swagger UI Express + Swagger JSDoc
- Winston — logs estruturados

---

## 🔑 Credenciais de Teste

| Campo   | Valor        |
|---------|--------------|
| Usuário | `admin`      |
| Senha   | `petcare123` |

---

## 🏗️ Arquitetura

```text
Frontend
    │
    ▼
Express Server
    │
    ├── API REST
    ├── Swagger
    └── SQLite
```
Todo o sistema é servido através do mesmo servidor Node.js na porta `3002`.
Não é necessário iniciar frontend e backend separadamente.

## 🚀 Como rodar

**1. Instale as dependências** (só na primeira vez):
```bash
npm install
```

**2. Inicie o servidor:**
```bash
npm start
```
---

**3. Acesse no navegador:**

| O que acessar | Endereço |
|---|---|
| Sistema completo (login + agendamentos) | http://localhost:3002 |
| Swagger UI (documentação interativa) | http://localhost:3002/docs |
| JSON para importar no Postman/Bruno | http://localhost:3002/docs.json |

---

> ⚠️ Mantenha o terminal aberto enquanto estiver testando! 
O banco SQLite é criado automaticamente na primeira execução e carregado com dados de exemplo (10 pets e 12 agendamentos).

> 🔄 **Para resetar os dados:**
> ```bash
> npm run reset-db
> npm start
> ```

---

## 📁 Estrutura do Projeto

```
petcare-sql-qa/
├── database/
│   ├── schema.sql          # Estrutura das tabelas
│   ├── seed.sql            # Dados de exemplo (10 pets, 12 agendamentos)
│   └── petcare.db          # Banco SQLite (gerado automaticamente)
├── routes/
│   ├── auth.js             # POST /auth/login
│   ├── agendamentos.js     # CRUD /agendamentos
│   ├── pets.js             # GET /pets e /pets/:id
│   └── estatisticas.js     # GET /estatisticas
├── src/
│   ├── db.js               # Conexão SQLite + operações
│   ├── validacao.js        # Regras de validação dos endpoints
│   ├── logger.js           # Configuração Winston
│   └── middleware/
│       └── httpLogger.js   # Middleware de log HTTP
├── logs/                   # Logs gerados (ignorado pelo Git)
├── server.js               # Servidor Express + Swagger + frontend estático
├── package.json
└── README.md
```
---

## 📡 Endpoints da API

| Método | Rota                  | Descrição                     |
|--------|-----------------------|-------------------------------|
| POST   | /auth/login           | Login do administrador        |
| GET    | /pets                 | Listar todos os pets          |
| GET    | /pets/:id             | Buscar pet por ID             |
| GET    | /agendamentos         | Listar todos (aceita filtros) |
| POST   | /agendamentos         | Criar novo agendamento        |
| GET    | /agendamentos/:id     | Buscar agendamento por ID     |
| PUT    | /agendamentos/:id     | Atualizar agendamento         |
| DELETE | /agendamentos/:id     | Remover agendamento           |
| GET    | /estatisticas         | Totais por status             |

### Filtros disponíveis em GET /agendamentos

```
GET /agendamentos?status=agendado
GET /agendamentos?pet=bolinha
GET /agendamentos?status=concluido&pet=rex
```

---

## 🗄️ Modelo de Dados

```
usuarios          pets               agendamentos
─────────────     ──────────────     ──────────────────
id                id                 id
usuario           nome               pet_id (FK → pets)
senha             porte              servico
nome              tutor              data
criado_em         telefone           horario
                  criado_em          status
                                     observacoes
                                     criado_em
```

---

## 📝 Queries SQL para Praticar

O arquivo `queries/petcare-queries.sql` contém **8 módulos progressivos**:

| Módulo | Conteúdo |
|--------|----------|
| 01 | SELECT básico |
| 02 | Filtros com WHERE e LIKE |
| 03 | Ordenação e LIMIT |
| 04 | Agregação e GROUP BY |
| 05 | JOINs (INNER e LEFT) |
| 06 | Subqueries |
| 07 | INSERT, UPDATE, DELETE |
| 08 | Queries de validação QA |

### Como praticar as queries

**Opção 1 — DB Browser for SQLite** (recomendado):
1. Baixe em https://sqlitebrowser.org/
2. Abra o arquivo `database/petcare.db`
3. Clique em "Execute SQL"
4. Cole e execute as queries do arquivo

**Opção 2 — Terminal:**
```bash
sqlite3 database/petcare.db
```

---

## 🧪 Cenários de teste com SQL

Use as queries do **Módulo 08** para validar ações no sistema:

1. Crie um agendamento via `POST /agendamentos`
2. Verifique no banco: `SELECT * FROM agendamentos WHERE id = ?`
3. Atualize o status via `PUT /agendamentos/:id`
4. Confirme no banco: `SELECT status FROM agendamentos WHERE id = ?`
5. Compare com `GET /estatisticas` vs query de agregação

---

## 🚀 Ferramentas sugeridas

- [DB Browser for SQLite](https://sqlitebrowser.org/) — visualizar e editar o banco
- [Playwright](https://playwright.dev/) — frontend e API
- [Cypress](https://www.cypress.io/) — frontend e API
- [Postman](https://www.postman.com/) / [Bruno](https://www.usebruno.com/) — API
- [Robot Framework](https://robotframework.org/) + Browser Library

---

## 🗂️ Ecossistema PetCare

| Repositório | Descrição | Porta |
|---|---|---|
| **petcare-qa** | Código-fonte do frontend | servido aqui |
| **petcare-sql-qa** | API REST + SQLite + Frontend (este repo) | `3002` |
| **petcare-sql-tests** | Playwright 38 testes | — |

---

## 🤝 Contribuições

Sinta-se à vontade para enviar sugestões, correções e melhorias através de pull requests.