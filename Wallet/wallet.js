const { STARTING_BALANCE } = require('../config');
const cryptohash = require('../Blockchain/crypto-hash');
const { ec } = require('./elliptic-ec');
const Transaction = require('./transaction');

class Wallet {

    constructor() {
        this.balance = STARTING_BALANCE;
        this.keyPair = ec.genKeyPair();
        this.publicKey = this.keyPair.getPublic().encode('hex');
    }

    sign(data) {
        // signature is the private key to the wallet
        // no instance created here for safety reasons

        return this.keyPair.sign(cryptohash(data));
    }

    createTransaction({ amount, recipient }) {
        
        if (amount > this.balance) {
            throw new Error('Amount exceeds balance');
        }
        return new Transaction({ senderWallet: this, recipient, amount });
        // new transaction instance needs to be created here!
    }
}

module.exports = Wallet;