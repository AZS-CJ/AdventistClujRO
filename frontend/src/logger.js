// eslint-disable-next-line @typescript-eslint/no-var-requires
const winston = require('winston')

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
})
