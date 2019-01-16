const bodyParser = require('body-parser');
const express = require('express');
const request = require('request');
const path = require('path');
const Blockchain = require('./Blockchain/blockchain');
const PubSub = require('./App/pubsub');
const TransactionPool = require('./Wallet/transaction-pool');
const Wallet = require('./Wallet/wallet');
const TransactionMiner = require('./App/transaction-miner');

const app = express();
const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const wallet = new Wallet();
const pubsub = new PubSub({ blockchain, transactionPool, wallet });
const transactionMiner = new TransactionMiner({
    blockchain, transactionPool, wallet, pubsub
});

const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;


app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'Client')));


app.get('/api/blocks', (request, response) => {
    response.json(blockchain.chain);
});

app.get('/api/transaction-pool-map', (req, res) => {
    res.json(transactionPool.transactionMap);
});

app.get('/api/mine-transactions', (req, res) => {
    transactionMiner.mineTransactions();
    res.redirect('/api/blocks');
});

app.get('/api/wallet-info', (req, res) => {
    const address = wallet.publicKey;
    res.json({
        address,
        balance: Wallet.calculateBalance({ chain: blockchain.chain, address })
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'Client/index.html'));
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
            transaction.update({ senderWallet: wallet, recipient, amount });
        } else {
            transaction = wallet.createTransaction({
                recipient, amount, chain: blockchain.chain
            });
        }
    } catch (error) {
        return res.status(400).json({ type: 'error', message: error.message });
    } // nicer error messages + making sure the app does not crash

    transactionPool.setTransaction(transaction);
    pubsub.broadcastTransaction(transaction);

    res.json({ type: 'success', transaction });
});


const syncWithRootState = () => {
    request({ url: `${ROOT_NODE_ADDRESS}/api/blocks` }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const rootChain = JSON.parse(body);

            console.log('replace chain on a sync with', rootChain);
            blockchain.replaceChain(rootChain);
        }
    });

    request({ url: `${ROOT_NODE_ADDRESS}/api/transaction-pool-map` }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const rootTransactionPoolMap = JSON.parse(body);

            console.log('\nreplace transaction pool map on a sync with', rootTransactionPoolMap);
            transactionPool.setMap(rootTransactionPoolMap);
        }
    });
}

let PEER_PORT;
// with the peer ports possible to have multiple instances of the blockchain application

if (process.env.GENERATE_PEER_PORT === 'true') {
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000); 
        // creating a random peer port with a port number between 3001 and 3999
}

const PORT = PEER_PORT || DEFAULT_PORT;
app.listen(PORT, () => {
    console.log(`listening at localhost:${PORT}`);

    if (PORT !== DEFAULT_PORT) {
        syncWithRootState();
    }
});