const Block = require('../block');
const { GENESIS_DATA } = require('../config');
const cryptoHash = require('../crypto-hash');

describe('Block', () => {
    const timestamp = Date.now();
    const lastHash = 'foo-lastHash';
    const hash = 'foo-hash';
    const data = ['data1', 'data2', 'data3'];
    const block = new Block({ timestamp, lastHash, hash, data });

    it('has all the properties needed', () => {
        expect(block.timestamp).toEqual(timestamp);
        expect(block.lastHash).toEqual(lastHash);
        expect(block.hash).toEqual(hash);
        expect(block.data).toEqual(data);
        // not best practice to have all these expects in one test!
    });

    describe('genesis()', () => {
        const genesisBlock = Block.genesis();
        //console.log('genesisBlock', genesisBlock);

        it('returns a Block instance', () => {
            expect(genesisBlock instanceof Block).toBe(true);
        });

        it('returns the genesis data', () => {
            expect(genesisBlock).toEqual(GENESIS_DATA);
        })
    });

    describe('mineBlock()', () => {
        const lastBlock = Block.genesis();
        const data = 'mined data';
        const minedBlock = Block.mineBlock({ lastBlock, data });

        it('returns a Block instance', () => {
            expect(minedBlock instanceof Block).toBe(true);
        });

        it('sets the `lastHash` to be the `hash` of the lastBlock', () => {
            expect(minedBlock.lastHash).toEqual(lastBlock.hash);
        });

        it('sets the `data`', () => {
            expect(minedBlock.data).toEqual(data);
        });

        it('has the `timestamp` defined', () => {
            expect(minedBlock.timestamp).not.toEqual(undefined);
        });

        it('creates a sha-256 `hash` based on the proper inputs', () => {
            expect(minedBlock.hash).toEqual(cryptoHash(minedBlock.timestamp, lastBlock.hash, data));
        });
    })
});