const winston = require('winston');
const { format } = require('winston');
const { combine, timestamp, printf } = format;

const LOGLEVEL = (process.env.LOGLEVEL || 'debug').toLowerCase();

const logFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] [${level}]: ${message}`;
});

let logTransports = [
  new winston.transports.File({
    name: 'error-file',
    filename: './logs/backend.log',
    stderrLevels: ['error', 'debug', 'warn', 'info'],
    json: false
  }),
  new winston.transports.Stream({
    stream: process.stderr,
    level: 'debug',
  }),
];

const logger = winston.createLogger({
  format: combine(
    timestamp({ format: 'YYYY-MM-dd HH:mm:ss' }),
    logFormat
  ),
  transports: logTransports,
  level: LOGLEVEL,
});

module.exports = {
  logger
};
