const PubNub = require('pubnub');

// Copyright PubNub
// This software is licensed under the MIT License.

const credentials = {
    publishKey: 'pub-c-b7306b64-9683-4b8f-84b1-b821a889e931',
    subscribeKey: 'sub-c-566b6ca2-1359-11e9-a843-26c2824ead74',
    secretKey: 'sec-c-M2QxNTg3OWYtYTRjYi00NGUwLWFkM2ItYjkwNjFjNDhlMDUx'
}

const CHANNELS = {
    BLOCKCHAIN: 'BLOCKCHAIN',
    TRANSACTION: 'TRANSACTION'
}

class PubSub {
    // The communication channel between the blockchains to keep the chain data updated.
    // If an update happens, it is broadcasted to the channel (by publisher/pub chain).
    // Every chain is listening (as a subscriber/sub) if there is an update to the blockchain and
    // updates the chain details in sync.

    constructor({ blockchain, transactionPool, wallet }) {

        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.pubnub = new PubNub(credentials);
        this.wallet = wallet;

        this.pubnub.subscribe({ channels: [Object.values(CHANNELS)] });
        this.pubnub.addListener(this.listener());
    }
    
    broadcastChain() {
        this.publish({
            channel: CHANNELS.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain)
        });
    }

    broadcastTransaction(transaction) {
        this.publish({
            channel: CHANNELS.TRANSACTION,
            message: JSON.stringify(transaction)
        });
    }

    publish({ channel, message }) {
        this.pubnub.publish({ message, channel });
        console.log(`\nMessage sent.`);
    }

    listener() {
        return {
            message: messageObject => {
                const { channel, message } = messageObject;
                console.log(`\nMessage received: \n Channel: ${channel} \n Message: ${message}\n`);
                
                const parsedMessage = JSON.parse(message);

                switch(channel) {
                    
                    case CHANNELS.BLOCKCHAIN:
                        this.blockchain.replaceChain(parsedMessage, true, () => {
                            this.transactionPool.clearBlockchainTransactions({
                                chain: parsedMessage
                            });
                        });
                        break;

                    case CHANNELS.TRANSACTION:
                        if (!this.transactionPool.existingTransaction({ 
                            inputAddress: this.wallet.publicKey })) {                            
                                this.transactionPool.setTransaction(parsedMessage);
                        }
                        break;
                        
                    default:
                        return;
                }
            }
        }
    }
}

module.exports = PubSub;