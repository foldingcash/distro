const log = require('./common/logger');
const downloader = require('./download_distro');
const sender = require('./send_distro');

(async function () {
    try {
        if(process.argv.length < 5){
            log.warn('the min required params was not provided, expecting amount, startDate, then endDate')
            return;
        }

        const amount = process.argv[2];
        const startDate = process.argv[3];
        const endDate = process.argv[4];

        log.info('downloading and sending distro started');
        const downloadResponse = await downloader.downloadDistro(amount, startDate, endDate);

        if (!downloadResponse || !downloadResponse.distro) {
            log.error('there was a problem downloading the distro');
            return;
        }

        await sender.sendDistro(downloadResponse.distro);
        log.info('downloading and sending distro finished');
    } catch (error) {
        log.error(typeof(error) === 'object' ? JSON.stringify(error) : error);
    }
})();