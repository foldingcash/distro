const datacash = require('@foldingcash/datacash');

const log = require('./common/logger');
const { fundingWif } = require('./configuration/wallet');

const basicMemo = "0x6d02";
const topicMemo = "0x6d0c";

(function () {
    try {
        log.info('starting send memo');
        //data: [topicMemo, "HelloWorld", "hello world via script"],
        const tx = {
            data: [basicMemo, "This is a test..."],
            cash: {
                key: fundingWif,
            },
        };
        datacash.send(tx, function(err) {
            err && log(err);
        });
    } catch (error) {
        log.error(typeof(error) === 'object' ? JSON.stringify(error) : error);
    }
})();