const Block = require('./block');
//import { Block } from './block';
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
    // static method is a function to the class, not to an object of it
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
            // without stringify never strictly equal since not the same instance -> never true
            return false
        };

        for (let i = 1; i < chain.length; i++) {
            const block = chain[i];
            const actualLastHash = chain[i - 1].hash;
            const { timestamp, lastHash, hash, nonce, difficulty, data} = block;
            const validatedHash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);

            if (lastHash !== actualLastHash) return false;
            if (hash !== validatedHash) return false;
        }
        return true;
    }

    replaceChain(chain) {
        if(chain.length <= this.chain.length) {
            console.error('The incoming chain needs to be longer than the original one.');
            return;
        }
        if(!Blockchain.isValidChain(chain)) {
            console.error('The incoming chain is not valid.');
            return;
        }
        
        console.log('Replacing chain with ', chain);
        this.chain = chain;

        //log errors and messages will not be printed out when testing
    }
}

module.exports = Blockchain;