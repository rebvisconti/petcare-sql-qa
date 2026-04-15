// routes/agendamentos.js

const express        = require('express');
const router         = express.Router();
const { Agendamentos } = require('../src/db');
const { validarAgendamento } = require('../src/validacao');

/**
 * @swagger
 * tags:
 *   name: Agendamentos
 *   description: Gerenciamento de agendamentos de banho e tosa
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Agendamento:
 *       type: object
 *       properties:
 *         id:          { type: integer }
 *         nomePet:     { type: string,  example: Bolinha }
 *         tutor:       { type: string,  example: Ana Lima }
 *         telefone:    { type: string,  example: "912345678" }
 *         servico:     { type: string,  enum: [banho, tosa, banho-tosa] }
 *         porte:       { type: string,  enum: [pequeno, medio, grande] }
 *         data:        { type: string,  format: date }
 *         horario:     { type: string,  example: "10:00" }
 *         status:      { type: string,  enum: [agendado, concluido, cancelado] }
 *         observacoes: { type: string }
 *         criado_em:   { type: string,  format: date-time }
 */

// GET /agendamentos
/**
 * @swagger
 * /agendamentos:
 *   get:
 *     summary: Lista todos os agendamentos
 *     tags: [Agendamentos]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [agendado, concluido, cancelado] }
 *       - in: query
 *         name: pet
 *         schema: { type: string }
 *         description: Filtrar por nome do pet (parcial)
 *     responses:
 *       200:
 *         description: Lista de agendamentos
 */
router.get('/', (req, res) => {
  const lista = Agendamentos.listar({
    status: req.query.status,
    pet:    req.query.pet,
  });
  res.json(lista);
});

// GET /agendamentos/:id
/**
 * @swagger
 * /agendamentos/{id}:
 *   get:
 *     summary: Busca agendamento por ID
 *     tags: [Agendamentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Agendamento encontrado
 *       404:
 *         description: Agendamento não encontrado
 */
router.get('/:id', (req, res) => {
  const ag = Agendamentos.buscarPorId(req.params.id);
  if (!ag) return res.status(404).json({ mensagem: 'Agendamento não encontrado.' });
  res.json(ag);
});

// POST /agendamentos
/**
 * @swagger
 * /agendamentos:
 *   post:
 *     summary: Cria um novo agendamento
 *     tags: [Agendamentos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nomePet, tutor, telefone, servico, porte, data, horario]
 *             properties:
 *               nomePet:     { type: string,  example: Bolinha }
 *               tutor:       { type: string,  example: Ana Lima }
 *               telefone:    { type: string,  example: "912345678" }
 *               servico:     { type: string,  enum: [banho, tosa, banho-tosa] }
 *               porte:       { type: string,  enum: [pequeno, medio, grande] }
 *               data:        { type: string,  format: date }
 *               horario:     { type: string,  example: "10:00" }
 *               observacoes: { type: string }
 *     responses:
 *       201:
 *         description: Agendamento criado com sucesso
 *       400:
 *         description: Dados inválidos ou horário ocupado
 */
router.post('/', (req, res) => {
  const erros = validarAgendamento(req.body);
  if (erros.length > 0)
    return res.status(400).json({ mensagem: 'Dados inválidos.', erros });

  if (Agendamentos.horarioOcupado(req.body.data, req.body.horario))
    return res.status(400).json({
      mensagem: 'Já existe um agendamento para esta data e horário.',
      erros: [{ campo: 'horario', mensagem: 'Horário indisponível.' }],
    });

  const novo = Agendamentos.criar(req.body);
  res.status(201).json({ mensagem: 'Agendamento criado com sucesso', agendamento: novo });
});

// PUT /agendamentos/:id
/**
 * @swagger
 * /agendamentos/{id}:
 *   put:
 *     summary: Atualiza um agendamento
 *     tags: [Agendamentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Agendamento atualizado
 *       404:
 *         description: Não encontrado
 */
router.put('/:id', (req, res) => {
  const ag = Agendamentos.buscarPorId(req.params.id);
  if (!ag) return res.status(404).json({ mensagem: 'Agendamento não encontrado.' });

  const erros = validarAgendamento(req.body, true);
  if (erros.length > 0)
    return res.status(400).json({ mensagem: 'Dados inválidos.', erros });

  if ((req.body.data || req.body.horario) &&
    Agendamentos.horarioOcupado(
      req.body.data    || ag.data,
      req.body.horario || ag.horario,
      req.params.id
    ))
    return res.status(400).json({
      mensagem: 'Já existe um agendamento para esta data e horário.',
      erros: [{ campo: 'horario', mensagem: 'Horário indisponível.' }],
    });

  const atualizado = Agendamentos.atualizar(req.params.id, req.body);
  res.json({ mensagem: 'Agendamento atualizado com sucesso', agendamento: atualizado });
});

// DELETE /agendamentos/:id
/**
 * @swagger
 * /agendamentos/{id}:
 *   delete:
 *     summary: Remove um agendamento
 *     tags: [Agendamentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Removido com sucesso
 *       404:
 *         description: Não encontrado
 */
router.delete('/:id', (req, res) => {
  const removido = Agendamentos.excluir(req.params.id);
  if (!removido) return res.status(404).json({ mensagem: 'Agendamento não encontrado.' });
  res.json({ mensagem: 'Agendamento removido com sucesso' });
});

module.exports = router;
