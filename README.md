🧪 Testes automatizados: https://github.com/rebvisconti/petcare-sql-tests

# 🐾 PetCare SQL QA
![Node.js](https://img.shields.io/badge/Node.js-backend-339933?logo=node.js&logoColor=white&style=for-the-badge)
![SQLite](https://img.shields.io/badge/SQLite-database-003B57?logo=sqlite&logoColor=white&style=for-the-badge)
![JavaScript](https://img.shields.io/badge/JavaScript-59.4%25-F7DF1E?logo=javascript&logoColor=black&style=for-the-badge)
![SQL](https://img.shields.io/badge/SQL-queries-blue?style=for-the-badge)
![API](https://img.shields.io/badge/API-REST-informational?style=for-the-badge)
![Tests](https://img.shields.io/badge/testing-QA%20focused-success?style=for-the-badge)
![Database](https://img.shields.io/badge/database-real%20data-important?style=for-the-badge)
![Practice](https://img.shields.io/badge/purpose-hands--on%20lab-blueviolet?style=for-the-badge)

API REST do sistema de agendamento PetCare com banco de dados **SQLite real**, desenvolvida para prática de automação de testes e queries SQL.

---

## 🎯 Objetivo do Projeto

Este projeto foi desenvolvido para simular um ambiente real de testes, permitindo:

- Validação de API REST com dados persistentes
- Execução de queries SQL para validação de backend
- Testes E2E integrando frontend + API + banco
- Prática de cenários reais de QA (CRUD, validações, consistência de dados)

---

## ✨ O que tem de novo nesta versão

- **Banco de dados SQLite** — dados persistem entre restarts do servidor
- **Tabela de pets separada** — permite praticar JOINs reais
- **Novo endpoint** `GET /pets` — lista todos os pets cadastrados
- **8 módulos progressivos de queries SQL** (do básico ao avançado, com foco em validação de testes)
- **Script de reset** — volta o banco ao estado inicial com um comando

---

## 🛠️ Tecnologias

- Node.js, Express, CORS
- **better-sqlite3** — banco SQLite síncrono e rápido
- Swagger UI Express, Swagger JSDoc

---

## 🔑 Credenciais de Teste

| Campo   | Valor        |
|---------|--------------|
| Usuário | `admin`      |
| Senha   | `petcare123` |

---

## 🚀 Como rodar

**1. Instale as dependências:**
```bash
npm install
```

**2. Inicie o servidor:**
```bash
npm start
```

O banco é criado automaticamente na primeira execução com 10 pets e 12 agendamentos de exemplo!

**3. Acesse:**

| O que acessar | Endereço |
|---|---|
| Swagger UI | http://localhost:3002/docs |
| JSON para Postman | http://localhost:3002/docs.json |

**4. Para resetar o banco:**
```bash
npm run reset-db
npm start
```

---

## 📁 Estrutura do Projeto

```
petcare-sql-qa/
├── database/
│   ├── schema.sql          # Estrutura das tabelas
│   ├── seed.sql            # Dados de exemplo
│   └── petcare.db          # Banco SQLite (gerado automaticamente)
├── queries/
│   └── petcare-queries.sql # 8 módulos de queries para praticar
├── routes/
│   ├── auth.js             # POST /auth/login
│   ├── agendamentos.js     # CRUD /agendamentos
│   ├── pets.js             # GET /pets e /pets/:id
│   └── estatisticas.js     # GET /estatisticas
├── src/
│   ├── db.js               # Conexão SQLite + operações
│   └── validacao.js        # Regras de validação
├── server.js               # Servidor Express + Swagger
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
- [Playwright](https://playwright.dev/) — automação E2E
- [Postman](https://www.postman.com/) — testar a API manualmente

---

## 🤝 Contribuições

Sinta-se à vontade para enviar sugestões, correções e melhorias através de pull requests.