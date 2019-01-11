const Blockhain = require('../Blockchain/blockchain');

// Some test data to see how many milliseconds it takes to mine a block.
// You can also see the average time and how the difficulty rises/lowers.

const blockchain = new Blockhain();
let prevTimestamp, nextTimestamp, nextBlock, timeDiff, average;
const times = [];

blockchain.addBlock({ data: 'data-genesis' });
console.log('first block', blockchain.chain[blockchain.chain.length - 1]);

for (let i = 0; i < 10000; i++) {
    prevTimestamp = blockchain.chain[blockchain.chain.length - 1].timestamp;

    blockchain.addBlock({ data: `data-block-${i}` });

    nextBlock = blockchain.chain[blockchain.chain.length - 1];
    nextTimestamp = nextBlock.timestamp;
    timeDiff = nextTimestamp - prevTimestamp;
    times.push(timeDiff);

    average = times.reduce((total, num) => (total + num)) / times.length;

    console.log(`Block-${i} \t ${timeDiff} ms 
    Diff: ${nextBlock.difficulty} \t\t Avg: ${average} ms`);
}