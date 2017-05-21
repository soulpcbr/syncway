import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import * as express from 'express';
import * as cors from 'cors';
import * as morgan from 'morgan';
import * as path from 'path';

import setRoutes from './routes';

const app = express();
app.use(cors());
app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, '../public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(morgan('dev'));

dotenv.load({ path: '.env' });

setRoutes(app);

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(app.get('port'), () => {
  console.log('Angular Full Stack listening on port ' + app.get('port'));
});

export { app };
