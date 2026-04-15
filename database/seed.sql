-- ================================================
-- PetCare SQL QA — Dados de Exemplo (Seed)
-- ================================================

-- ── Usuário administrador ─────────────────────────
INSERT INTO usuarios (usuario, senha, nome) VALUES
  ('admin', 'petcare123', 'Administrador PetCare');

-- ── Pets ──────────────────────────────────────────
INSERT INTO pets (nome, porte, tutor, telefone) VALUES
  ('Bolinha',  'pequeno', 'Ana Lima',        '912345678'),
  ('Rex',      'grande',  'Carlos Souza',    '961234567'),
  ('Mimi',     'medio',   'Joana Ferreira',  '934567890'),
  ('Thor',     'grande',  'Pedro Costa',     '923456789'),
  ('Mel',      'pequeno', 'Lucia Mendes',    '945678901'),
  ('Pipoca',   'medio',   'Fernando Silva',  '956789012'),
  ('Totó',     'pequeno', 'Mariana Rocha',   '967890123'),
  ('Simba',    'grande',  'Roberto Alves',   '978901234'),
  ('Luna',     'medio',   'Patricia Lima',   '989012345'),
  ('Duque',    'grande',  'André Santos',    '990123456');

-- ── Agendamentos ──────────────────────────────────
INSERT INTO agendamentos (pet_id, servico, data, horario, status, observacoes) VALUES
  (1, 'banho-tosa', '2026-05-10', '10:00', 'agendado',  'Alérgico a shampoo com perfume'),
  (2, 'tosa',       '2026-05-10', '14:00', 'agendado',  ''),
  (3, 'banho',      '2026-05-09', '09:00', 'concluido', ''),
  (4, 'banho-tosa', '2026-05-11', '08:00', 'agendado',  'Muito agitado, cuidado'),
  (5, 'banho',      '2026-05-11', '11:00', 'agendado',  ''),
  (6, 'tosa',       '2026-05-08', '15:00', 'concluido', 'Tosa estilo teddy bear'),
  (7, 'banho',      '2026-05-12', '09:00', 'agendado',  ''),
  (8, 'banho-tosa', '2026-05-07', '10:00', 'cancelado', 'Cliente cancelou'),
  (9, 'banho',      '2026-05-12', '14:00', 'agendado',  ''),
  (10,'tosa',       '2026-05-13', '16:00', 'agendado',  ''),
  (1, 'banho',      '2026-05-14', '09:00', 'agendado',  'Segunda visita do Bolinha'),
  (3, 'banho-tosa', '2026-05-06', '11:00', 'concluido', '');
