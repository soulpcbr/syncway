import * as fs from 'fs';
import * as winston from 'winston';
import * as util from 'util';


const logDirectory = (process.env.LOG_DIR || './logs');
const logName = (process.env.LOG_FILENAME || './syncway.log');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({
      level: 'info',
      filename: `${logDirectory}/${logName}`,
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false
    }),
    new winston.transports.Console({
      level: 'info',
      handleExceptions: true,
      json: false,
      colorize: true
    })
  ],
  exitOnError: false
});

export default logger;


function formatArgs(args) {
  return [util.format.apply(util.format, Array.prototype.slice.call(args))];
}
console.log = function(){
  logger.info.apply(logger, formatArgs(arguments));
};
console.info = function(){
  logger.info.apply(logger, formatArgs(arguments));
};
console.warn = function(){
  logger.warn.apply(logger, formatArgs(arguments));
};
console.error = function(){
  logger.error.apply(logger, formatArgs(arguments));
};
console.debug = function(){
  logger.debug.apply(logger, formatArgs(arguments));
};
