// routes/estatisticas.js

const express          = require('express');
const router           = express.Router();
const { Agendamentos } = require('../src/db');

/**
 * @swagger
 * tags:
 *   name: Estatísticas
 *   description: Totais e resumos do sistema
 */

/**
 * @swagger
 * /estatisticas:
 *   get:
 *     summary: Retorna estatísticas gerais
 *     tags: [Estatísticas]
 *     responses:
 *       200:
 *         description: Estatísticas calculadas com sucesso
 */
router.get('/', (_req, res) => res.json(Agendamentos.estatisticas()));

module.exports = router;
