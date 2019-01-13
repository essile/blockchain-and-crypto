const TransactionPool = require("../Wallet/transaction-pool");
const Transaction = require("../Wallet/transaction");
const Wallet = require("../Wallet/wallet");

describe('TransactionPool', () => {
    let transactionPool, transaction, senderWallet;

    beforeEach(() => {
        transactionPool = new TransactionPool();
        senderWallet = new Wallet();
        transaction = new Transaction({
            senderWallet,
            recipient: 'herp-recipient',
            amount: 70
        });
    });

    describe('setTransaction()', () => {
        it('adds a transaction', () => {
            transactionPool.setTransaction(transaction);
            expect(transactionPool.transactionMap[transaction.id]).toBe(transaction);
            // the exact transaction
        });
    });

    describe('existingTransaction()', () => {
        it('returns an existing transaction gien an input address', () => {
           transactionPool.setTransaction(transaction);
           expect(
               transactionPool.existingTransaction({ inputAddress: senderWallet.publicKey })
           ).toBe(transaction);
        });
    });
});