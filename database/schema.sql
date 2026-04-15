-- ================================================
-- PetCare SQL QA — Schema do Banco de Dados
-- ================================================

PRAGMA foreign_keys = ON;

-- ── Tabela de usuários (administradores) ─────────
CREATE TABLE IF NOT EXISTS usuarios (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario    TEXT    NOT NULL UNIQUE,
  senha      TEXT    NOT NULL,
  nome       TEXT    NOT NULL,
  criado_em  TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ── Tabela de pets ────────────────────────────────
CREATE TABLE IF NOT EXISTS pets (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  nome      TEXT    NOT NULL CHECK(length(nome) >= 2 AND length(nome) <= 50),
  porte     TEXT    NOT NULL CHECK(porte IN ('pequeno', 'medio', 'grande')),
  tutor     TEXT    NOT NULL CHECK(length(tutor) >= 3 AND length(tutor) <= 100),
  telefone  TEXT    NOT NULL,
  criado_em TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ── Tabela de agendamentos ────────────────────────
CREATE TABLE IF NOT EXISTS agendamentos (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  pet_id      INTEGER NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  servico     TEXT    NOT NULL CHECK(servico IN ('banho', 'tosa', 'banho-tosa')),
  data        TEXT    NOT NULL,
  horario     TEXT    NOT NULL CHECK(horario IN ('08:00','09:00','10:00','11:00','14:00','15:00','16:00','17:00')),
  status      TEXT    NOT NULL DEFAULT 'agendado' CHECK(status IN ('agendado', 'concluido', 'cancelado')),
  observacoes TEXT    DEFAULT '',
  criado_em   TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ── Índices para performance ──────────────────────
CREATE INDEX IF NOT EXISTS idx_agendamentos_data    ON agendamentos(data);
CREATE INDEX IF NOT EXISTS idx_agendamentos_status  ON agendamentos(status);
CREATE INDEX IF NOT EXISTS idx_agendamentos_pet_id  ON agendamentos(pet_id);
CREATE INDEX IF NOT EXISTS idx_pets_tutor           ON pets(tutor);
