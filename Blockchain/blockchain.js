const Block = require('./block');
const cryptoHash = require('./crypto-hash');

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
            const { timestamp, lastHash, hash, nonce, difficulty, data} = chain[i];
            
            if (lastHash !== actualLastHash) return false;
            
            const validatedHash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);
            
            if (hash !== validatedHash) return false;
            if (Math.abs(lastDifficulty - difficulty) > 1) return false;
        }
        return true;
    }

    replaceChain(chain) {
        // The chain is always written again to include the new block.
        // log errors and messages will not be printed out when testing.

        if(chain.length <= this.chain.length) {
            console.error('The incoming chain needs to be longer than the original one.');
            return;
        }
        if(!Blockchain.isValidChain(chain)) {
            console.error('The incoming chain is not valid.');
            return;
        }
        
        console.log('Replacing chain with \n', chain);
        this.chain = chain;

    }
}

module.exports = Blockchain;