// server.js — PetCare SQL QA
// API REST com SQLite + Swagger UI

const express      = require('express');
const cors         = require('cors');
const swaggerUi    = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const { inicializar }    = require('./src/db');
const authRoutes         = require('./routes/auth');
const agendamentosRoutes = require('./routes/agendamentos');
const petsRoutes         = require('./routes/pets');
const estatisticasRoutes = require('./routes/estatisticas');

const app  = express();
const PORT = 3002;

// ── Inicializa o banco ─────────────────────────
inicializar();

// ── Middlewares ────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Swagger ────────────────────────────────────
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '🐾 PetCare SQL QA — API',
      version: '2.0.0',
      description:
        'API REST com banco de dados SQLite real. ' +
        'Desenvolvida para prática de automação de testes e queries SQL.',
    },
    servers: [{ url: `http://localhost:${PORT}`, description: 'Servidor local' }],
    tags: [
      { name: 'Autenticação',  description: 'Login do administrador' },
      { name: 'Pets',          description: 'Gerenciamento de pets' },
      { name: 'Agendamentos',  description: 'CRUD de agendamentos' },
      { name: 'Estatísticas',  description: 'Totais e resumos' },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: '🐾 PetCare SQL QA',
  customCss: `
    .swagger-ui .topbar { background-color: #3D2314; }
    .swagger-ui .topbar-wrapper img { display: none; }
    .swagger-ui .topbar-wrapper::before {
      content: '🐾 PetCare SQL QA';
      color: white; font-size: 1.2rem; font-weight: bold; padding-left: 1rem;
    }
    .swagger-ui .info .title { color: #3D2314; }
    .swagger-ui .btn.execute { background: #E8622A; border-color: #E8622A; }
  `,
}));

app.get('/docs.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// ── Rotas ──────────────────────────────────────
app.use('/auth',         authRoutes);
app.use('/pets',         petsRoutes);
app.use('/agendamentos', agendamentosRoutes);
app.use('/estatisticas', estatisticasRoutes);

// ── Start ──────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('  🐾  PetCare SQL QA rodando!');
  console.log(`  ➜  API:   http://localhost:${PORT}`);
  console.log(`  ➜  Docs:  http://localhost:${PORT}/docs`);
  console.log(`  ➜  JSON:  http://localhost:${PORT}/docs.json`);
  console.log('  ➜  DB:    database/petcare.db');
  console.log('');
});

module.exports = app;
