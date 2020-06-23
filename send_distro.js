const slpsdk = require('slp-sdk');
const fs = require('fs');
const sleep = require('./common/sleep');
const log = require('./common/logger');
const { fundingAddress, bchChangeReceiverAddress, fundingWif, tokenId } = require('./configuration/wallet');
const { batchCount, sendTokensRetryWaitSeconds, sendTokensRetryCount, failedFoldersFileName } = require('./configuration/distro');

const slp = new slpsdk();

exports.sendDistro = (async function (distro) {
    try {
        log.info('starting send distro');
        log.debug('received ' + JSON.stringify(distro));
        await handleDistro(distro);
        log.info('finished send distro')
    }
    catch (error) {
        log.error(error);
        log.debug('received ' + distro);
    }
});

async function handleDistro(distro) {
    // TODO: Check for min amount of funds estimate the total amount
    // >11k sats required per bulk transaction
    log.verbose('starting to send distro');

    const filteredFolders = filterFolders(distro);
    log.verbose('sending to total folders ' + filteredFolders.length);

    const chunkedFolders = chunkArray(filteredFolders, batchCount);
    log.verbose('total chunks ' + chunkedFolders.length);

    const failedFolders = [];

    for (let index = 0; index < chunkedFolders.length; index++) {
        const currentChunkFolders = chunkedFolders[index];
        await handleBulkDistro(currentChunkFolders, failedFolders);
    }

    if (failedFolders.length > 0) {
        log.debug('failed folders ' + JSON.stringify(failedFolders));
        log.warn('there was at least one failed send');
        log.verbose('writing failed folders to file');
        fs.writeFileSync(failedFoldersFileName, JSON.stringify({ distro: failedFolders }));
        log.verbose('finished writing failed folders to file');
        return;
    }

    log.info('finished sending distro');
}

async function handleBulkDistro(folders, failedFolders) {
    await handleBulkDistroWithRetry(folders, sendTokensRetryCount, failedFolders);
}

async function handleBulkDistroWithRetry(folders, retryAttempts, failedFolders) {
    try {
        const slpAddresses = folders.map(folder => slp.Address.toSLPAddress(folder.bitcoinAddress));
        const amounts = folders.map(folder => folder.amount);

        const config = {
            fundingAddress: fundingAddress,
            fundingWif: fundingWif,
            tokenReceiverAddress: slpAddresses,
            bchChangeReceiverAddress,
            tokenId,
            amount: amounts,
        };

        log.debug('sending tokens with config ' + JSON.stringify(config));
        log.info('about to send some tokens');

        const send = await slp.TokenType1.send(config);

        log.verbose('txId ' + send);
    }
    catch (error) {
        log.error(typeof(error) === 'object' ? JSON.stringify(error) : error);
        if (retryAttempts > 0) {
            const retryAttemptsLeft = --retryAttempts;
            log.warn('retrying with ' + retryAttemptsLeft + ' left');
            await sleep(sendTokensRetryWaitSeconds * 1000);
            await handleBulkDistroWithRetry(folders, retryAttemptsLeft);
        } else {
            folders.forEach(folder => {
                failedFolders.push(folder);
            });
        }
    }
}

function filterFolders(distro) {
    return distro.filter(folder => {
        try {
            slp.Address.toSLPAddress(folder.bitcoinAddress);
            return folder.amount > 0;
        } catch{
            return false;
        }
    });
}

function chunkArray(myArray, chunk_size) {
    log.verbose('starting to chunk array');
    let results = [];

    while (myArray.length) {
        results.push(myArray.splice(0, chunk_size));
    }

    log.verbose('finished chunking array');
    return results;
}