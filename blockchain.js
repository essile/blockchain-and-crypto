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
        console.log('chain', chain);
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
            // without stringify never strictly equal since not the same instance -> never true
            return false
        };

        for (let i = 1; i < chain.length; i++) {
            const block = chain[i];
            const actualLastHash = chain[i - 1].hash;
            const { timestamp, lastHash, hash, data} = block;
            const validatedHash = cryptoHash(timestamp, lastHash, data);

            if (lastHash !== actualLastHash) return false;
            if (hash !== validatedHash) return false;
        }
        return true;
    }
}

module.exports = Blockchain;