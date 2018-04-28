const crypto = require('crypto');
exports.create = function (info , secret) {
    secret = secret ? secret : 'linchaoqun';
    const hash = crypto.createHmac('sha256', secret)
        .update(info)
        .digest('hex');
    return hash;
};
