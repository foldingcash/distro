const superagent = require('superagent');
const log = require('./common/logger');
const sleep = require('./common/sleep');
const { timeoutHours, distroUrl, downloadRetryCount, downloadRetryWaitSeconds } = require('./configuration/distro');

exports.downloadDistro = (async function (amount, startDate, endDate) {
    log.info('starting download distro');
    const distro = await downloadDistroWithRetry(amount, startDate, endDate, downloadRetryCount);
    log.info('finished download distro');
    return distro;
});

async function downloadDistroWithRetry(amount, startDate, endDate, retryAttempts) {
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
        log.error(typeof (error) === 'object' ? JSON.stringify(error) : error);
        log.error('response received ' + JSON.stringify(response));
        if (retryAttempts > 0) {
            const retryAttemptsLeft = --retryAttempts;
            log.warn('retrying with ' + retryAttemptsLeft + ' left');
            log.verbose('sleeping');
            await sleep(downloadRetryWaitSeconds * 1000);
            log.verbose('finished sleeping');
            return await downloadDistroWithRetry(amount, startDate, endDate, retryAttemptsLeft);
        }
        else {
            log.error('the download failed with multiple attempts');
            throw error;
        }
    }
}