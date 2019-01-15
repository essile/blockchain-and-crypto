const Block = require('./block');
const cryptoHash = require('./crypto-hash');
const Transaction = require('../Wallet/transaction');
const Wallet = require('../Wallet/wallet');
const { REWARD_INPUT, MINING_REWARD } = require('../config');

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()];
    }

    addBlock({ data }) {
        const newBlock = Block.mineBlock({
            lastBlock: this.chain[this.chain.length - 1],
            data
        });

        this.chain.push(newBlock);
    }

    replaceChain(chain, validateTransactions, onSuccess) {
        // The chain is always written again to include the new block.
        // Log errors and messages will not be printed out when testing.
        // validateTransactions flag prevents other than arrays (dummy test data)

        if (chain.length <= this.chain.length) {
            console.error('The incoming chain needs to be longer than the original one.');
            return;
        }
        if (!Blockchain.isValidChain(chain)) {
            console.error('The incoming chain is not valid.');
            return;
        }
        if (validateTransactions && !this.validTransactionData({ chain })) {
            console.error('The incoming chain has invalid transaction data.');
            return;
        }

        if (onSuccess) onSuccess();
        console.log('Replacing chain with \n', chain);
        this.chain = chain;
    }

    validTransactionData({ chain }) {
        // validating the data in the chain so that
        // - the data is formatted correctly
        // - there is one mining reward per block only
        // - valid input amounts are according the balance in blockchain history
        // - there's no identical transactions

        for (let i = 1; i < chain.length; i++) {
            const block = chain[i];
            const transactionSet = new Set(); // will contain all the blocks
            let rewardTransactionCount = 0;

            for (let transaction of block.data) {
                if (transaction.input.address === REWARD_INPUT.address) {
                    rewardTransactionCount += 1;

                    if (rewardTransactionCount > 1) {
                        console.error('Miner rewards exceed limit.');
                        return false;
                    }
                    if (Object.values(transaction.outputMap)[0] !== MINING_REWARD) {
                        // first item accessed like this in case we do not know the publicKey
                        console.error('Miner reward amount is invalid.');
                        return false;
                    }
                } else {
                    if (!Transaction.validTransaction(transaction)) {
                        console.error('Invalid transaction.')
                        return false;
                    }

                    const trueBalance = Wallet.calculateBalance({
                        chain: this.chain, // not the incoming chain that can be invalid!
                        address: transaction.input.address
                    });

                    if (transaction.input.amount !== trueBalance) {
                        console.error('Invalid input amount.');
                        return false;
                    }

                    if (transactionSet.has(transaction)) {
                        console.error('Several identical transactions in one block');
                        return false;
                    } else {
                        transactionSet.add(transaction);
                    }
                }
            }
        }
        return true;
    }

    static isValidChain(chain) {
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
            // without stringify never strictly equal since not the same instance -> never true
            return false;
        };

        for (let i = 1; i < chain.length; i++) {
            // checking each block so that 
            // - the hash of the previous block matches the lastHash,
            // - the hash is valid = old data has not been altered
            // - there is no difficulty jumps

            const actualLastHash = chain[i - 1].hash;
            const lastDifficulty = chain[i - 1].difficulty;
            const { timestamp, lastHash, hash, nonce, difficulty, data } = chain[i];

            if (lastHash !== actualLastHash) return false;

            const validatedHash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);

            if (hash !== validatedHash) return false;
            if (Math.abs(lastDifficulty - difficulty) > 1) return false;
        }
        return true;
    }

}

module.exports = Blockchain;