const slpsdk = require('slp-sdk');
const fs = require('fs');
const sleep = require('./common/sleep');
const log = require('./common/logger');
const { fundingAddress, bchChangeReceiverAddress, fundingWif, tokenId } = require('./configuration/wallet');
const { batchCount, sendTokensRetryWaitSeconds, sendTokensRetryCount, failedFoldersFileName, transactionIdsFileName } = require('./configuration/distro');

const slp = new slpsdk();

exports.sendMemo = (async function (memo) {
    try {
        log.info('starting send distro');
        log.debug('received ' + JSON.stringify(memo));
    }
    catch (error) {
        log.error(error);
        log.debug('received ' + memo);
    }
});