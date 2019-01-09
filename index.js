const bodyParser = require('body-parser');
const express = require('express');
const Blockchain = require('./blockchain');
const PubSub = require('./pubsub');

const app = express();
const blockchain = new Blockchain();
const pubsub = new PubSub({ blockchain });

setTimeout(() => pubsub.broadcastChain(), 1000);

const DEFAULT_PORT = 3000;

app.use(bodyParser.json());

app.get('/api/blocks', (request, response) => {
    response.json(blockchain.chain);
});

app.post('/api/mine', (req, res) => {
    const { data } = req.body;
    blockchain.addBlock({ data });
    res.redirect('/api/blocks');
});

app.listen(DEFAULT_PORT, ()=> console.log(`listening at localhost:${DEFAULT_PORT}`));