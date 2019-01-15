const crypto = require('crypto'); // node module

const cryptoHash = (...inputs) => {
    // takes any amount of inputs, sorts and stringifies them → creates an unique hash

    const hash = crypto.createHash('sha256');
    hash.update(inputs.map((input) => JSON.stringify(input)).sort().join(' '));
    return hash.digest('hex');
};

module.exports = cryptoHash;