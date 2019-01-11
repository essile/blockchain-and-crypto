const cryptoHash = require('../Blockchain/crypto-hash');

describe('cryptoHash()', () => {

    it('generates a SHA-256 hashed output', () => {
        expect(cryptoHash('essi')).toEqual('52e107ce130eeafca523d7b2497167a0054c8659176aee8d218b598a4dc42963');
    });

    it('produces the same hash with the same input arguments in any order', () => {
        expect(cryptoHash('one', 'two', 'three')).toEqual(cryptoHash('two', 'three', 'one'));
    });

    it('produces a unique hash when the propersties have changed on an input', () => {
        const herp = {};
        const originalHash = cryptoHash(herp);
        herp['a'] = 'a';

        expect(cryptoHash(herp)).not.toEqual(originalHash);
    });
});