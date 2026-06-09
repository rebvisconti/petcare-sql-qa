// src/middleware/httpLogger.js — Middleware de log de requisições HTTP

const logger = require('../logger');

function httpLogger(req, res, next) {
  const inicio = Date.now();

  const originalSend = res.send.bind(res);

  res.send = function (body) {
    const duracao    = Date.now() - inicio;
    const statusCode = res.statusCode;
    const nivel      = statusCode >= 500 ? 'error'
                     : statusCode >= 400 ? 'warn'
                     : 'info';

    logger[nivel](`${req.method} ${req.originalUrl}`, {
      method:      req.method,
      url:         req.originalUrl,
      status:      statusCode,
      duration_ms: duracao,
      ip:          req.ip || req.connection?.remoteAddress,
      ...(req.body && Object.keys(req.body).length > 0
        ? { body: sanitizarBody(req.body) }
        : {}),
    });

    return originalSend(body);
  };

  next();
}

function sanitizarBody(body) {
  const clone = { ...body };
  if (clone.senha) clone.senha = '***';
  return clone;
}

module.exports = { httpLogger };