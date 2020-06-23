const superagent = require('superagent');
const log = require('./common/logger');
const { timeoutHours, distroUrl } = require('./configuration/configuration');

exports.downloadDistro = (async function (amount, startDate, endDate) {
    let response = null;

    try {
        const requestUrl = distroUrl + '?amount=' + amount + '&startDate=' + startDate + '&endDate=' + endDate;

        log.verbose('Attempting to get distro from ' + requestUrl);
        log.verbose('Using timeout ' + timeoutHours + ' hour(s)');
        response = await superagent.get(requestUrl).timeout(timeoutHours * 60 * 60 * 1000);

        log.debug('processing response ' + response.text);
        const responseObject = JSON.parse(response.text);

        if (!responseObject.success || !responseObject.distro) {
            log.error(JSON.stringify(responseObject));
            return;
        }

        log.info('finished downloading distro');
        return { distro: responseObject.distro };
    } catch (error) {
        log.error(error);
        log.error('response received ' + JSON.stringify(response));
    }
});