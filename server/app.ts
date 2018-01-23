import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import * as express from 'express';
import * as cors from 'cors';
import * as path from 'path';
import * as socketIo from 'socket.io';
dotenv.config();

import setRoutes from './routes';
import setTask from './tasks';
import logger from './logger';


const app = express();
app.use(cors());
app.set('port', (process.env.PORT || 3000));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

setRoutes(app);

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});


const server = app.listen(app.get('port'), () => {
  logger.log('info', 'Angular Full Stack listening on port ' + app.get('port'));
});


/**
 * Socket events
 */
const io = socketIo(server, {transports: ['websocket']});
setTask(io);

export { app };
