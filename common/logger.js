const { createLogger, format: { simple, combine, timestamp }, transports } = require('winston');
const { loggingLevel } = require('../configuration/logging');

module.exports = createLogger({
    level: loggingLevel,
    format: combine(timestamp(), simple()),
    transports: [
        new transports.Console()
    ]
});