const { createLogger, format: { simple, combine, timestamp }, transports } = require('winston');
const configuration = require('../configuration/configuration');

module.exports = createLogger({
    level: configuration.loggingLevel,
    format: combine(timestamp(), simple()),
    transports: [
        new transports.Console()
    ]
});