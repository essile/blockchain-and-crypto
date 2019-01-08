const MINE_RATE = 1000; // millisecond
const INITIAL_DIFFICULTY = 3;

// hard coded data - name written with capital letters
const GENESIS_DATA = {
    timestamp: 2019,
    lastHash: "-----",
    hash: 'hash-1',
    difficulty: INITIAL_DIFFICULTY,
    nonce: 0,
    data: []
};

module.exports = { GENESIS_DATA, MINE_RATE };