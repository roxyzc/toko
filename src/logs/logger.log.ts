import { transports, createLogger, format } from "winston";

const logger = createLogger({
  transports: [new transports.Console({})],
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.ms(),
    format.printf(({ timestamp, message, level, ms }) => {
      return `[${timestamp}] - ${ms} ${level}: ${message} `;
    })
  ),
});

export default logger;
