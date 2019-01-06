const cryptoHash = require('../crypto-hash');

describe('cryptoHash()', () => {

    it('generates a SHA-256 hashed output', () => {
        expect(cryptoHash('essi')).toEqual('36ef09eb8f8b2a6a6dbc1ccfac64471f05e1494674621710559f47b87ac0a2e3');
    });

    it('produces the same hash with the same input arguments in any order', () => {
        expect(cryptoHash('one', 'two', 'three')).toEqual(cryptoHash('two', 'three', 'one'));
    });
});