const uuid = require('uuid/v1');
const { verifySignature } = require('./elliptic-ec');
const { REWARD_INPUT, MINING_REWARD } = require('../config');

class Transaction {

    constructor({ senderWallet, recipient, amount, outputMap, input }) {
        this.id = uuid();
        this.outputMap = outputMap || this.createOutputMap({ senderWallet, recipient, amount });
        this.input = input || this.createInput({ senderWallet, outputMap: this.outputMap });

        // Transaction is a mining reward when 'outputMap' and 'input' come in as parameters
        // otherwise a normal transaction
    }

    createOutputMap({ senderWallet, recipient, amount }) {
        const outputMap = {};

        outputMap[recipient] = amount;
        outputMap[senderWallet.publicKey] = senderWallet.balance - amount;

        return outputMap;
    }

    createInput({ senderWallet, outputMap }) {
        return {
            timestamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(outputMap)
        };
    }

    update({ senderWallet, recipient, amount }) {

        if (amount > this.outputMap[senderWallet.publicKey]) {
            throw new Error('Amount exceeds balance');
        }
        if (!this.outputMap[recipient]) {
            this.outputMap[recipient] = amount;
        } else {
            this.outputMap[recipient] = this.outputMap[recipient] + amount;
        }

        this.outputMap[senderWallet.publicKey] = this.outputMap[senderWallet.publicKey] - amount;
        this.input = this.createInput({ senderWallet, outputMap: this.outputMap });
    }

    static validTransaction(transaction) {
        // checking there's enough balance in the wallet and
        // that the signature (=the private key to the wallet) is valid

        const { input: { address, amount, signature }, outputMap } = transaction;

        let outputTotal = 0;

        Object.values(outputMap).map(transactionAmount => {
            console.log(transactionAmount + ' tuli sisään ja on nyt ' + typeof (transactionAmount));
            outputTotal = +transactionAmount + outputTotal;
        });
        console.log('yht ' + outputTotal);

        if (amount !== outputTotal) {
            console.error(`Invalid transaction from ${address}. Amount: ${amount}, Total: ${outputTotal}`);
            return false;
        }
        if (!verifySignature({ publicKey: address, data: outputMap, signature: signature })) {
            console.error(`Invalid signature from ${signature}`);
            return false;
        }
        return true;
    }

    static rewardTransaction({ minerWallet }) {
        return new this({
            input: REWARD_INPUT,
            outputMap: { [minerWallet.publicKey]: MINING_REWARD }
        })
    }
}

module.exports = Transaction;