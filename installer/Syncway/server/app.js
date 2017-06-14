"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bodyParser = require("body-parser");
var dotenv = require("dotenv");
var express = require("express");
var cors = require("cors");
var path = require("path");
var fs = require("fs");
var winston = require("winston");
var util = require("util");
var routes_1 = require("./routes");
var tasks_1 = require("./tasks");
var app = express();
exports.app = app;
app.use(cors());
app.set('port', (process.env.PORT || 3000));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
var logDirectory = './logs';
// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
// winston
winston.emitErrs = true;
var logger = new winston.Logger({
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: logDirectory + '/syncway-logs.log',
            handleExceptions: true,
            json: true,
            maxsize: 5242880,
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
routes_1.default(app);
tasks_1.default(app);
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});
app.listen(app.get('port'), function () {
    console.log('Angular Full Stack listening on port ' + app.get('port'));
});
function formatArgs(args) {
    return [util.format.apply(util.format, Array.prototype.slice.call(args))];
}
console.log = function () {
    logger.info.apply(logger, formatArgs(arguments));
};
console.info = function () {
    logger.info.apply(logger, formatArgs(arguments));
};
console.warn = function () {
    logger.warn.apply(logger, formatArgs(arguments));
};
console.error = function () {
    logger.error.apply(logger, formatArgs(arguments));
};
console.debug = function () {
    logger.debug.apply(logger, formatArgs(arguments));
};
//# sourceMappingURL=app.js.map