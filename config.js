const MINE_RATE = 1000; // millisecond
const INITIAL_DIFFICULTY = 3;

// hard coded data - name written with capital letters
const GENESIS_DATA = {
    timestamp: 2019,
    lastHash: "-----",
    hash: 'hash-genesis',
    difficulty: INITIAL_DIFFICULTY,
    nonce: 0,
    data: []
};

const STARTING_BALANCE = 1000;

const REWARD_INPUT = { address: '*authorized-reward*' };

const MINING_REWARD = 50;

module.exports = { 
    GENESIS_DATA, 
    MINE_RATE, 
    STARTING_BALANCE, 
    REWARD_INPUT,
    MINING_REWARD
};