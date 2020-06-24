exports.distroUrl = 'https://fahstatsapi.azurewebsites.net/v1/GetDistro';
exports.timeoutHours = 1;
exports.downloadRetryCount = 3;
exports.downloadRetryWaitSeconds = 300;

exports.batchCount = 18;
exports.sendTokensRetryWaitSeconds = 30;
exports.sendTokensRetryCount = 3;
exports.failedFoldersFileName = './FailedFolders.json';