// src/logger.js — Configuração do Winston

const winston = require('winston');
const path    = require('path');
const fs      = require('fs');

// Garante que a pasta logs existe
const LOGS_DIR = path.join(process.cwd(), 'logs');
if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR, { recursive: true });
}

// ── Formato customizado para o console ────────────────────────
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const extras = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] ${level}: ${message}${extras}`;
  })
);

// ── Formato JSON para arquivos ─────────────────────────────────
const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// ── Logger principal ───────────────────────────────────────────
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  transports: [

    // Console — colorido e legível
    new winston.transports.Console({
      format: consoleFormat,
    }),

    // Arquivo geral — tudo em JSON
    new winston.transports.File({
      filename: path.join(LOGS_DIR, 'app.log'),
      format:   fileFormat,
      maxsize:  5 * 1024 * 1024, // 5MB
      maxFiles: 3,
    }),

    // Arquivo só de erros
    new winston.transports.File({
      filename: path.join(LOGS_DIR, 'error.log'),
      level:    'error',
      format:   fileFormat,
      maxsize:  5 * 1024 * 1024,
      maxFiles: 3,
    }),
  ],
});

module.exports = logger;