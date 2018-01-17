import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import * as express from 'express';
import * as cors from 'cors';
import * as path from 'path';
import * as fs from 'fs';
import * as winston from 'winston';
import * as util from 'util';

import setRoutes from './routes';
import setTask from './tasks';
import * as socketIo from 'socket.io';


const app = express();
app.use(cors());
app.set('port', (process.env.PORT || 3000));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const logDirectory = './logs';
// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// winston
winston.emitErrs = true;

const logger = new winston.Logger({
  transports: [
    new winston.transports.File({
      level: 'info',
      filename: logDirectory + '/syncway-logs.log',
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
module.exports = logger;


/*// create a rotating write stream
const accessLogStream = rfs('access.log', {
  interval: '1d', // rotate daily
  path: logDirectory
});

// setup the logger
// app.use(morgan('combined', {stream: logger.stream }));*/

dotenv.load({ path: '.env' });

setRoutes(app);

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

const server = app.listen(app.get('port'), () => {
  console.log('Angular Full Stack listening on port ' + app.get('port'));
});

/**
 * Socket events
 */
const io = socketIo(server, {transports: ['websocket']});

io.on('connect', (socket: any) => {
  console.log('Connected client on port %s.');
  socket.on('status', (s: any) => {
    console.log('[loop](status): %s', JSON.stringify(s));
    io.emit('status', s);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});


setTask(io);

export { app };

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

