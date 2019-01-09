const Blockhain = require('../blockchain');

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

    console.log(`Time to mine block-${i} \t ${timeDiff} ms \t Diff: ${nextBlock.difficulty} \t Avg: ${average}ms`)
}