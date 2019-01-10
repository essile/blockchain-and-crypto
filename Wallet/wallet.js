const { STARTING_BALANCE } = require('../config');
const cryptohash = require('../Blockchain/crypto-hash');
const { ec } = require('./elliptic-ec');

class Wallet {

    constructor() {
        this.balance = STARTING_BALANCE;        
        this.keyPair = ec.genKeyPair();
        this.publicKey = this.keyPair.getPublic().encode('hex');
    }

    sign(data) {
        return this.keyPair.sign(cryptohash(data));
    }
}

module.exports = Wallet;