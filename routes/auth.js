// routes/auth.js

const express    = require('express');
const router     = express.Router();
const { Usuarios } = require('../src/db');

/**
 * @swagger
 * tags:
 *   name: Autenticação
 *   description: Login do administrador
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login do administrador
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [usuario, senha]
 *             properties:
 *               usuario: { type: string, example: admin }
 *               senha:   { type: string, example: petcare123 }
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       400:
 *         description: Campos obrigatórios ausentes
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/login', (req, res) => {
  const { usuario, senha } = req.body;

  if (!usuario || !senha)
    return res.status(400).json({ mensagem: 'Usuário e senha são obrigatórios.' });

  const user = Usuarios.buscarPorCredenciais(usuario, senha);
  if (!user)
    return res.status(401).json({ mensagem: 'Usuário ou senha incorretos.' });

  res.json({
    mensagem: 'Login realizado com sucesso',
    usuario:  { usuario: user.usuario, nome: user.nome },
  });
});

module.exports = router;
