const hexToBinary = require('hex-to-binary');
const { GENESIS_DATA, MINE_RATE } = require('../config');
const cryptoHash = require('./crypto-hash');

class Block {
    constructor({ timestamp, lastHash, hash, data, nonce, difficulty }) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty;
    }

    static genesis() {
        // the beginning of the blockchain
        return new this(GENESIS_DATA);
    };

    static mineBlock({ lastBlock, data }) {
        // proof of work: it takes time + computational power (=money) to find a valid hash

        let hash, timestamp;
        const lastHash = lastBlock.hash;
        let { difficulty } = lastBlock;
        let nonce = 0;

        do {
            nonce++;
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty({ originalBlock: lastBlock, timestamp });
                // difficulty gets adjusted so that it is not too fast/slow to mine a new block
            hash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);
        } while (hexToBinary(hash).substring(0, difficulty) !== '0'.repeat(difficulty));

        return new this({
            timestamp,
            lastHash,
            data,
            difficulty,
            nonce,
            hash
        });
    }

    static adjustDifficulty({ originalBlock, timestamp }) { 
        // makes mining a block harder/easier to keep the mining time stable 
        // → to keep it secure

        if (originalBlock.difficulty < 1) return 1;
        if ((timestamp - originalBlock.timestamp) > MINE_RATE) return originalBlock.difficulty - 1;
        return originalBlock.difficulty + 1;
    }
}

module.exports = Block;