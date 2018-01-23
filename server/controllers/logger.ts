import logger from '../logger';

export class LoggerCtrl {

  constructor() {
  }

  logs = (req, res) => {
    const from = req.param('from'), until = req.param('until'),
      limit = req.param('limit');

    this.list({
      limit: limit,
      from: from,
      until: until,
    }).then( (logs) => {
      res.status(200).json({
        logs: logs,
      });
    });
  }

  list = (options) => {
    options.limit = options.limit || 50;
    return new Promise((resolve, reject) => {
      logger.query(options, (error, logs) => {
        if (error) {
          return reject(error);
        }
        resolve(logs);
      });
    });
  }

}


