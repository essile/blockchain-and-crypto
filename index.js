const bodyParser = require('body-parser');
const express = require('express');
const request = require('request');
const Blockchain = require('./Blockchain/blockchain');
const PubSub = require('./Blockchain/pubsub');
const TransactionPool = require('./Wallet/transaction-pool');
const Wallet = require('./Wallet/wallet');

const app = express();
const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const wallet = new Wallet();
const pubsub = new PubSub({ blockchain });

const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;

// setTimeout(() => pubsub.broadcastChain(), 1000);

app.use(bodyParser.json());

app.get('/api/blocks', (request, response) => {
    response.json(blockchain.chain);
});

app.post('/api/mine', (req, res) => {
    const { data } = req.body;
    blockchain.addBlock({ data });

    pubsub.broadcastChain();
    res.redirect('/api/blocks');
});

app.post('/api/transact', (req, res) => {
    const { amount, recipient } = req.body;
    let transaction = transactionPool
        .existingTransaction({ inputAddress: wallet.publicKey });

    try {
        if (transaction) {
            transaction.update({ senderWallet: wallet, recipient, amount })
        } else {
            transaction = wallet.createTransaction({ recipient, amount });
        }
    } catch (error) {
        return res.status(400).json({ type: 'error', message: error.message });
    } // nicer error messages + making sure the app does not crash

    transactionPool.setTransaction(transaction);
    console.log('transactionPool', transactionPool);
    res.json({ type: 'success', transaction });
});

const syncChains = () => {
    request({ url: `${ROOT_NODE_ADDRESS}/api/blocks` }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const rootChain = JSON.parse(body);

            console.log('replace chain on a sync with', rootChain);
            blockchain.replaceChain(rootChain);
        }
    });
}

let PEER_PORT;
if (process.env.GENERATE_PEER_PORT === 'true') {
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000); // random number 1-1000;
}

const PORT = PEER_PORT || DEFAULT_PORT;
app.listen(PORT, () => {
    console.log(`listening at localhost:${PORT}`);

    if (PORT !== DEFAULT_PORT) {
        syncChains();
    }
});