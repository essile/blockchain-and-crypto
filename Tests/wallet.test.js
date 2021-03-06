const Wallet = require('../Wallet/wallet');
const { verifySignature } = require('../Wallet/elliptic-ec');
const Transaction = require('../Wallet/transaction');
const Blockchain = require('../Blockchain/blockchain');
const { STARTING_BALANCE } = require('../config');

describe('Wallet', () => {
    let wallet;

    beforeEach(() => {
        wallet = new Wallet();
    });

    it('has a `balance`', () => {
        expect(wallet).toHaveProperty('balance');
    });

    it('has a `publicKey`', () => {
        expect(wallet).toHaveProperty('publicKey');
        //console.log('publicKey: ', wallet.publicKey);
    });

    describe('signing data', () => {
        const data = 'testdata';

        it('verifies a signature', () => {
            expect(
                verifySignature({
                    publicKey: wallet.publicKey,
                    data,
                    signature: wallet.sign(data)
                })
            ).toBe(true);
        });

        it('does not verify an invalid signature', () => {
            expect(
                verifySignature({
                    publicKey: wallet.publicKey,
                    data,
                    signature: new Wallet().sign(data)
                })
            ).toBe(false);
        });
    });

    describe('createTransaction', () => {
        describe('and the amount exceeds the balance', () => {
            it('throws an error', () => {
                expect(() => wallet.createTransaction({
                    amount: 999999,
                    recipient: 'derp-recipient'
                })
                ).toThrow('Amount exceeds balance');
            });
        });

        describe('and the amount is valid', () => {
            let transaction, amount, recipient;

            beforeEach(() => {
                amount = 50;
                recipient = 'derp-recipient';
                transaction = wallet.createTransaction({ amount, recipient });
            });

            it('creates an instance of `Transaction`', () => {
                expect(transaction instanceof Transaction).toBe(true);
            });

            it('matches the transaction input with the wallet', () => {
                expect(transaction.input.address).toEqual(wallet.publicKey);
            });

            it('outputs the amount the recipient', () => {
                expect(transaction.outputMap[recipient]).toEqual(amount);
            });
        });

        describe('and the chain is passed', () => {
            it('calls `Wallet.calculateBalance`', () => {

                const calculateBalanceMock = jest.fn();
                const originalCalculateBalance = Wallet.calculateBalance;
                // when changing the original calculateBalance method saving
                // it so that it can be used normally later

                Wallet.calculateBalance = calculateBalanceMock;

                wallet.createTransaction({
                    recipient: 'herp',
                    amount: 10,
                    chain: new Blockchain().chain
                });
                expect(calculateBalanceMock).toHaveBeenCalled();

                Wallet.calculateBalance = originalCalculateBalance;
            });
        });
    });

    describe('calculateBalance()', () => {
        let blockchain;

        beforeEach(() => {
            blockchain = new Blockchain();
        });

        describe('and there are no outputs for the wallet', () => {
            it('returns the `STARTING_BALANCE`', () => {
                expect(
                    Wallet.calculateBalance({
                        chain: blockchain.chain,
                        address: wallet.publicKey
                    })
                ).toEqual(STARTING_BALANCE)
            });
        });

        describe('and there are outputs for the wallet', () => {
            let transaction1, transaction2;

            beforeEach(() => {
                transaction1 = new Wallet().createTransaction({
                    recipient: wallet.publicKey,
                    amount: 50
                });
                transaction2 = new Wallet().createTransaction({
                    recipient: wallet.publicKey,
                    amount: 100
                });

                blockchain.addBlock({ data: [transaction1, transaction2] });
            });

            it('adds the sum of all outputs to the wallet balance', () => {
                expect(
                    Wallet.calculateBalance({
                        chain: blockchain.chain,
                        address: wallet.publicKey
                    })
                ).toEqual(
                    STARTING_BALANCE +
                    transaction1.outputMap[wallet.publicKey] +
                    transaction2.outputMap[wallet.publicKey]
                );
            });

            describe('and the wallet has made a transaction', () => {
                let recentTransaction;

                beforeEach(() => {
                    recentTransaction = wallet.createTransaction({
                        recipient: 'some-address',
                        amount: 30
                    });

                    blockchain.addBlock({ data: [recentTransaction] });
                });

                it('return the output amount of the recent transaction', () => {
                    expect(
                        Wallet.calculateBalance({
                            chain: blockchain.chain,
                            address: wallet.publicKey
                        })
                    ).toEqual(recentTransaction.outputMap[wallet.publicKey]);
                });

                describe('and there are outputs next to and after the recent transaction', () => {
                    let sameBlockTransaction, nextBlockTransaction;

                    beforeEach(() => {
                        recentTransaction = wallet.createTransaction({
                            recipient: 'later-address',
                            amount: 70
                        });

                        sameBlockTransaction = Transaction.rewardTransaction({ minerWallet: wallet });
                        blockchain.addBlock({ data: [recentTransaction, sameBlockTransaction] });

                        nextBlockTransaction = new Wallet().createTransaction({
                            recipient: wallet.publicKey, amount: 100
                        });
                        blockchain.addBlock({ data: [nextBlockTransaction] });
                    });

                    it('includes the ouput amounts in the returned balance', () => {
                        expect(
                            Wallet.calculateBalance({
                                chain: blockchain.chain,
                                address: wallet.publicKey
                            })
                        ).toEqual(
                            recentTransaction.outputMap[wallet.publicKey] +
                            sameBlockTransaction.outputMap[wallet.publicKey] +
                            nextBlockTransaction.outputMap[wallet.publicKey]
                        )
                    });
                });
            });
        });
    });
});