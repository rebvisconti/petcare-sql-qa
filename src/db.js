// src/db.js — Conexão e inicialização do banco SQLite

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '..', 'database', 'petcare.db');
const SCHEMA_PATH = path.join(__dirname, '..', 'database', 'schema.sql');
const SEED_PATH = path.join(__dirname, '..', 'database', 'seed.sql');

// Abre ou cria o banco
const db = new Database(DB_PATH);

// Ativa chaves estrangeiras
db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');

// Inicializa o schema se o banco estiver vazio
function inicializar() {
  const schema = fs.readFileSync(SCHEMA_PATH, 'utf-8');
  db.exec(schema);

  // Popula com dados de exemplo se não houver usuários
  const total = db.prepare('SELECT COUNT(*) as total FROM usuarios').get();

  if (total.total === 0) {
    const seed = fs.readFileSync(SEED_PATH, 'utf-8');
    db.exec(seed);
    console.log('✅ Banco inicializado com dados de exemplo!');
  }
}

// ── Usuários ───────────────────────────────────────────────
const Usuarios = {
  buscarPorCredenciais(usuario, senha) {
    return db.prepare(
      'SELECT id, usuario, nome FROM usuarios WHERE usuario = ? AND senha = ?'
    ).get(usuario, senha);
  },
};

// ── Pets ───────────────────────────────────────────────────
const Pets = {
  listar() {
    return db.prepare('SELECT * FROM pets ORDER BY nome').all();
  },

  buscarPorId(id) {
    return db.prepare('SELECT * FROM pets WHERE id = ?').get(id) || null;
  },

  criar(dados) {
    const stmt = db.prepare(`
      INSERT INTO pets (nome, porte, tutor, telefone)
      VALUES (@nome, @porte, @tutor, @telefone)
    `);

    const result = stmt.run(dados);
    return this.buscarPorId(result.lastInsertRowid);
  },

  atualizar(id, dados) {
    const pet = this.buscarPorId(id);
    if (!pet) return null;

    db.prepare(`
      UPDATE pets
      SET nome = @nome,
          porte = @porte,
          tutor = @tutor,
          telefone = @telefone
      WHERE id = @id
    `).run({ ...dados, id });

    return this.buscarPorId(id);
  },

  excluir(id) {
    const result = db.prepare('DELETE FROM pets WHERE id = ?').run(id);
    return result.changes > 0;
  },
};

// ── Agendamentos ───────────────────────────────────────────
const Agendamentos = {
  listar(filtros = {}) {
    let sql = `
      SELECT
        a.id, a.servico, a.data, a.horario, a.status, a.observacoes, a.criado_em,
        p.id AS pet_id,
        p.nome AS nomePet,
        p.porte,
        p.tutor,
        p.telefone
      FROM agendamentos a
      JOIN pets p ON p.id = a.pet_id
      WHERE 1=1
    `;

    const params = [];

    if (filtros.status) {
      sql += ' AND a.status = ?';
      params.push(filtros.status);
    }

    if (filtros.pet) {
      sql += ' AND p.nome LIKE ?';
      params.push(`%${filtros.pet}%`);
    }

    sql += ' ORDER BY a.data, a.horario';

    return db.prepare(sql).all(...params);
  },

  buscarPorId(id) {
    return db.prepare(`
      SELECT
        a.id, a.servico, a.data, a.horario, a.status, a.observacoes, a.criado_em,
        p.id AS pet_id,
        p.nome AS nomePet,
        p.porte,
        p.tutor,
        p.telefone
      FROM agendamentos a
      JOIN pets p ON p.id = a.pet_id
      WHERE a.id = ?
    `).get(id) || null;
  },

  criar(dados) {
    let pet = db.prepare(
      'SELECT * FROM pets WHERE nome = ? AND tutor = ?'
    ).get(dados.nomePet, dados.tutor);

    if (!pet) {
      const result = db.prepare(`
        INSERT INTO pets (nome, porte, tutor, telefone)
        VALUES (@nomePet, @porte, @tutor, @telefone)
      `).run(dados);

      pet = Pets.buscarPorId(result.lastInsertRowid);
    }

    const result = db.prepare(`
      INSERT INTO agendamentos (pet_id, servico, data, horario, status, observacoes)
      VALUES (@pet_id, @servico, @data, @horario, @status, @observacoes)
    `).run({
      pet_id: pet.id,
      servico: dados.servico,
      data: dados.data,
      horario: dados.horario,
      status: dados.status || 'agendado',
      observacoes: dados.obs || dados.observacoes || '',
    });

    return this.buscarPorId(result.lastInsertRowid);
  },

  atualizar(id, dados) {
    const ag = this.buscarPorId(id);
    if (!ag) return null;

    if (dados.nomePet || dados.porte || dados.tutor || dados.telefone) {
      db.prepare(`
        UPDATE pets SET
          nome = COALESCE(@nomePet, nome),
          porte = COALESCE(@porte, porte),
          tutor = COALESCE(@tutor, tutor),
          telefone = COALESCE(@telefone, telefone)
        WHERE id = @pet_id
      `).run({ ...dados, pet_id: ag.pet_id });
    }

    db.prepare(`
      UPDATE agendamentos SET
        servico = COALESCE(@servico, servico),
        data = COALESCE(@data, data),
        horario = COALESCE(@horario, horario),
        status = COALESCE(@status, status),
        observacoes = COALESCE(@observacoes, observacoes)
      WHERE id = @id
    `).run({
      servico: dados.servico || null,
      data: dados.data || null,
      horario: dados.horario || null,
      status: dados.status || null,
      observacoes: dados.obs || dados.observacoes || null,
      id,
    });

    return this.buscarPorId(id);
  },

  excluir(id) {
    const result = db.prepare('DELETE FROM agendamentos WHERE id = ?').run(id);
    return result.changes > 0;
  },

  horarioOcupado(data, horario, ignorarId = null) {
    const sql = ignorarId
      ? `SELECT id FROM agendamentos WHERE data = ? AND horario = ? AND status != 'cancelado' AND id != ?`
      : `SELECT id FROM agendamentos WHERE data = ? AND horario = ? AND status != 'cancelado'`;

    const params = ignorarId ? [data, horario, ignorarId] : [data, horario];

    return !!db.prepare(sql).get(...params);
  },

  estatisticas() {
    return db.prepare(`
      SELECT
        COUNT(*) AS totalAgendamentos,
        SUM(CASE WHEN status = 'agendado' THEN 1 ELSE 0 END) AS agendados,
        SUM(CASE WHEN status = 'concluido' THEN 1 ELSE 0 END) AS concluidos,
        SUM(CASE WHEN status = 'cancelado' THEN 1 ELSE 0 END) AS cancelados,
        COUNT(DISTINCT pet_id) AS petsUnicos
      FROM agendamentos
    `).get();
  },
};

module.exports = { db, inicializar, Usuarios, Pets, Agendamentos };