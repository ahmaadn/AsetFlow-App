import winston from 'winston';

/**
 * Tentukan level log yang berbeda dan warnanya
 */
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

/**
 * Tentukan format log
 */
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  // Tampilkan log dengan warna jika bukan di environment production
  process.env.NODE_ENV !== 'production'
    ? winston.format.colorize({ all: true })
    : winston.format.uncolorize(),
  winston.format.align(),
  winston.format.printf(
    (info) => `[${info.timestamp}] ${info.level}: ${info.message}`
  )
);

/**
 * Tentukan 'transports' (output untuk log, misal: console, file)
 */
const transports = [
  // Selalu tampilkan log di console
  new winston.transports.Console(),

  // Menonaktifkan penyimpanan log ke file untuk saat ini dikarenakan vercel tidak
  // mendukung penyimpanan file secara persisten

  // Simpan log error ke file jika di production
  // new winston.transports.File({
  //   filename: 'logs/error.log',
  //   level: 'error',
  //   format: winston.format.combine(format, winston.format.uncolorize()),
  // }),

  // Simpan semua log ke file lain jika di production
  // new winston.transports.File({
  //   filename: 'logs/all.log',
  //   format: winston.format.combine(format, winston.format.uncolorize()),
  // }),
];

/**
 * Buat logger
 */
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL,
  levels,
  format,
  transports,
});

export default logger;
