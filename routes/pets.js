// routes/pets.js

const express    = require('express');
const router     = express.Router();
const { Pets }   = require('../src/db');

/**
 * @swagger
 * tags:
 *   name: Pets
 *   description: Gerenciamento de pets cadastrados
 */

/**
 * @swagger
 * /pets:
 *   get:
 *     summary: Lista todos os pets
 *     tags: [Pets]
 *     responses:
 *       200:
 *         description: Lista de pets
 */
router.get('/', (_req, res) => res.json(Pets.listar()));

/**
 * @swagger
 * /pets/{id}:
 *   get:
 *     summary: Busca pet por ID
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Pet encontrado
 *       404:
 *         description: Pet não encontrado
 */
router.get('/:id', (req, res) => {
  const pet = Pets.buscarPorId(req.params.id);
  if (!pet) return res.status(404).json({ mensagem: 'Pet não encontrado.' });
  res.json(pet);
});

module.exports = router;
