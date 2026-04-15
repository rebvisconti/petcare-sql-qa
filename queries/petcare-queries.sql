-- ================================================
-- PetCare SQL QA — Guia de Queries para Praticar
-- ================================================
-- Abra este arquivo no DB Browser for SQLite
-- ou execute via: sqlite3 database/petcare.db
-- ================================================


-- ╔══════════════════════════════════════════════╗
-- ║  MÓDULO 01 — SELECT BÁSICO                   ║
-- ╚══════════════════════════════════════════════╝

-- 01.1 Listar todos os pets
SELECT * FROM pets;

-- 01.2 Listar apenas nome e tutor dos pets
SELECT nome, tutor FROM pets;

-- 01.3 Listar todos os agendamentos
SELECT * FROM agendamentos;

-- 01.4 Listar agendamentos com campos específicos
SELECT id, servico, data, horario, status FROM agendamentos;

-- 01.5 Contar total de pets cadastrados
SELECT COUNT(*) AS total_pets FROM pets;

-- 01.6 Contar total de agendamentos
SELECT COUNT(*) AS total_agendamentos FROM agendamentos;


-- ╔══════════════════════════════════════════════╗
-- ║  MÓDULO 02 — FILTROS COM WHERE               ║
-- ╚══════════════════════════════════════════════╝

-- 02.1 Buscar agendamentos com status 'agendado'
SELECT * FROM agendamentos WHERE status = 'agendado';

-- 02.2 Buscar agendamentos concluídos
SELECT * FROM agendamentos WHERE status = 'concluido';

-- 02.3 Buscar agendamentos cancelados
SELECT * FROM agendamentos WHERE status = 'cancelado';

-- 02.4 Buscar pets de porte pequeno
SELECT * FROM pets WHERE porte = 'pequeno';

-- 02.5 Buscar agendamentos de uma data específica
SELECT * FROM agendamentos WHERE data = '2026-05-10';

-- 02.6 Buscar agendamentos de um horário específico
SELECT * FROM agendamentos WHERE horario = '10:00';

-- 02.7 Buscar pets cujo nome começa com 'B'
SELECT * FROM pets WHERE nome LIKE 'B%';

-- 02.8 Buscar pets cujo tutor contém 'Lima'
SELECT * FROM pets WHERE tutor LIKE '%Lima%';

-- 02.9 Buscar agendamentos entre duas datas
SELECT * FROM agendamentos
WHERE data BETWEEN '2026-05-10' AND '2026-05-12';

-- 02.10 Buscar agendamentos que NÃO foram cancelados
SELECT * FROM agendamentos WHERE status != 'cancelado';

-- 02.11 Buscar agendamentos de banho OU tosa (sem banho-tosa)
SELECT * FROM agendamentos WHERE servico IN ('banho', 'tosa');

-- 02.12 Buscar pets com porte grande ou médio
SELECT * FROM pets WHERE porte IN ('grande', 'medio');


-- ╔══════════════════════════════════════════════╗
-- ║  MÓDULO 03 — ORDENAÇÃO E LIMITE              ║
-- ╚══════════════════════════════════════════════╝

-- 03.1 Listar agendamentos ordenados por data
SELECT * FROM agendamentos ORDER BY data;

-- 03.2 Listar agendamentos ordenados por data e horário
SELECT * FROM agendamentos ORDER BY data, horario;

-- 03.3 Listar os 5 agendamentos mais recentes
SELECT * FROM agendamentos ORDER BY criado_em DESC LIMIT 5;

-- 03.4 Listar pets em ordem alfabética
SELECT * FROM pets ORDER BY nome ASC;

-- 03.5 Listar os 3 primeiros agendamentos agendados
SELECT * FROM agendamentos
WHERE status = 'agendado'
ORDER BY data, horario
LIMIT 3;


-- ╔══════════════════════════════════════════════╗
-- ║  MÓDULO 04 — AGREGAÇÃO E AGRUPAMENTO         ║
-- ╚══════════════════════════════════════════════╝

-- 04.1 Contar agendamentos por status
SELECT status, COUNT(*) AS total
FROM agendamentos
GROUP BY status;

-- 04.2 Contar agendamentos por serviço
SELECT servico, COUNT(*) AS total
FROM agendamentos
GROUP BY servico
ORDER BY total DESC;

-- 04.3 Contar agendamentos por porte do pet
SELECT p.porte, COUNT(a.id) AS total_agendamentos
FROM agendamentos a
JOIN pets p ON p.id = a.pet_id
GROUP BY p.porte;

-- 04.4 Contar agendamentos por data
SELECT data, COUNT(*) AS total
FROM agendamentos
GROUP BY data
ORDER BY data;

-- 04.5 Verificar estatísticas gerais (igual ao GET /estatisticas)
SELECT
  COUNT(*)                                              AS totalAgendamentos,
  SUM(CASE WHEN status = 'agendado'  THEN 1 ELSE 0 END) AS agendados,
  SUM(CASE WHEN status = 'concluido' THEN 1 ELSE 0 END) AS concluidos,
  SUM(CASE WHEN status = 'cancelado' THEN 1 ELSE 0 END) AS cancelados,
  COUNT(DISTINCT pet_id)                                AS petsUnicos
FROM agendamentos;

-- 04.6 Quantos agendamentos cada pet tem?
SELECT p.nome, COUNT(a.id) AS total_agendamentos
FROM pets p
LEFT JOIN agendamentos a ON a.pet_id = p.id
GROUP BY p.id, p.nome
ORDER BY total_agendamentos DESC;

-- 04.7 Qual serviço é mais solicitado?
SELECT servico, COUNT(*) AS total
FROM agendamentos
GROUP BY servico
ORDER BY total DESC
LIMIT 1;


-- ╔══════════════════════════════════════════════╗
-- ║  MÓDULO 05 — JOINs                           ║
-- ╚══════════════════════════════════════════════╝

-- 05.1 Listar agendamentos com nome do pet (INNER JOIN)
SELECT
  a.id,
  p.nome     AS pet,
  p.tutor,
  a.servico,
  a.data,
  a.horario,
  a.status
FROM agendamentos a
JOIN pets p ON p.id = a.pet_id
ORDER BY a.data, a.horario;

-- 05.2 Listar todos os pets e seus agendamentos (LEFT JOIN)
-- Pets sem agendamentos também aparecem
SELECT
  p.nome     AS pet,
  p.tutor,
  a.servico,
  a.data,
  a.status
FROM pets p
LEFT JOIN agendamentos a ON a.pet_id = p.id
ORDER BY p.nome;

-- 05.3 Listar agendamentos pendentes com contato do tutor
SELECT
  p.nome     AS pet,
  p.tutor,
  p.telefone,
  a.servico,
  a.data,
  a.horario
FROM agendamentos a
JOIN pets p ON p.id = a.pet_id
WHERE a.status = 'agendado'
ORDER BY a.data, a.horario;

-- 05.4 Histórico completo de um pet específico
SELECT
  p.nome     AS pet,
  a.servico,
  a.data,
  a.horario,
  a.status,
  a.observacoes
FROM agendamentos a
JOIN pets p ON p.id = a.pet_id
WHERE p.nome = 'Bolinha'
ORDER BY a.data;

-- 05.5 Pets com agendamentos cancelados
SELECT DISTINCT
  p.nome,
  p.tutor,
  p.telefone
FROM pets p
JOIN agendamentos a ON a.pet_id = p.id
WHERE a.status = 'cancelado';


-- ╔══════════════════════════════════════════════╗
-- ║  MÓDULO 06 — SUBQUERIES                      ║
-- ╚══════════════════════════════════════════════╝

-- 06.1 Pets que têm pelo menos 2 agendamentos
SELECT nome, tutor FROM pets
WHERE id IN (
  SELECT pet_id FROM agendamentos
  GROUP BY pet_id
  HAVING COUNT(*) >= 2
);

-- 06.2 Agendamentos do pet mais agendado
SELECT * FROM agendamentos
WHERE pet_id = (
  SELECT pet_id FROM agendamentos
  GROUP BY pet_id
  ORDER BY COUNT(*) DESC
  LIMIT 1
);

-- 06.3 Pets que NUNCA tiveram agendamento cancelado
SELECT nome, tutor FROM pets
WHERE id NOT IN (
  SELECT pet_id FROM agendamentos
  WHERE status = 'cancelado'
);

-- 06.4 Data com mais agendamentos
SELECT data, COUNT(*) AS total FROM agendamentos
GROUP BY data
HAVING total = (
  SELECT MAX(cnt) FROM (
    SELECT COUNT(*) AS cnt FROM agendamentos GROUP BY data
  )
);


-- ╔══════════════════════════════════════════════╗
-- ║  MÓDULO 07 — INSERT, UPDATE, DELETE          ║
-- ╚══════════════════════════════════════════════╝

-- 07.1 Cadastrar um novo pet
INSERT INTO pets (nome, porte, tutor, telefone)
VALUES ('Caramelo', 'medio', 'Sofia Martins', '912000001');

-- 07.2 Criar um agendamento para o pet recém cadastrado
INSERT INTO agendamentos (pet_id, servico, data, horario, observacoes)
VALUES (
  (SELECT id FROM pets WHERE nome = 'Caramelo'),
  'banho', '2026-05-20', '10:00', 'Primeira visita'
);

-- 07.3 Atualizar status de agendamento para concluído
UPDATE agendamentos SET status = 'concluido' WHERE id = 1;

-- 07.4 Cancelar todos os agendamentos de uma data
UPDATE agendamentos SET status = 'cancelado'
WHERE data = '2026-05-10' AND status = 'agendado';

-- 07.5 Atualizar telefone de um tutor
UPDATE pets SET telefone = '900000000' WHERE tutor = 'Ana Lima';

-- 07.6 Excluir um agendamento específico
DELETE FROM agendamentos WHERE id = 12;

-- 07.7 Excluir agendamentos cancelados há mais de 30 dias
DELETE FROM agendamentos
WHERE status = 'cancelado'
AND date(criado_em) < date('now', '-30 days');


-- ╔══════════════════════════════════════════════╗
-- ║  MÓDULO 08 — QUERIES DE VALIDAÇÃO QA         ║
-- ╚══════════════════════════════════════════════╝
-- Use estas queries para verificar dados após
-- ações no frontend ou na API!

-- 08.1 Verificar se agendamento foi criado corretamente
-- (substitua o ID pelo retornado pela API)
SELECT
  a.*,
  p.nome AS nomePet,
  p.tutor
FROM agendamentos a
JOIN pets p ON p.id = a.pet_id
WHERE a.id = 1;

-- 08.2 Verificar conflito de horário
SELECT COUNT(*) AS conflitos
FROM agendamentos
WHERE data = '2026-05-10'
  AND horario = '10:00'
  AND status != 'cancelado';

-- 08.3 Verificar se status foi atualizado corretamente
SELECT id, status FROM agendamentos WHERE id = 1;

-- 08.4 Confirmar exclusão de agendamento
SELECT COUNT(*) AS deve_ser_zero
FROM agendamentos WHERE id = 999;

-- 08.5 Verificar integridade — agendamentos sem pet associado
SELECT a.id FROM agendamentos a
LEFT JOIN pets p ON p.id = a.pet_id
WHERE p.id IS NULL;

-- 08.6 Verificar estatísticas após ações no frontend
-- Compare com o retorno de GET /estatisticas
SELECT
  COUNT(*)                                              AS totalAgendamentos,
  SUM(CASE WHEN status = 'agendado'  THEN 1 ELSE 0 END) AS agendados,
  SUM(CASE WHEN status = 'concluido' THEN 1 ELSE 0 END) AS concluidos,
  SUM(CASE WHEN status = 'cancelado' THEN 1 ELSE 0 END) AS cancelados,
  COUNT(DISTINCT pet_id)                                AS petsUnicos
FROM agendamentos;
