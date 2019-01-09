const PubNub = require('pubnub');

const credientials = {
    publishKey: 'pub-c-b7306b64-9683-4b8f-84b1-b821a889e931',
    subscribeKey: 'sub-c-566b6ca2-1359-11e9-a843-26c2824ead74',
    secretKey: 'sec-c-M2QxNTg3OWYtYTRjYi00NGUwLWFkM2ItYjkwNjFjNDhlMDUx'
}

const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN'
}

class PubSub {
    constructor({ blockchain }) {

        this.blockchain = blockchain;
        this.pubnub = new PubNub(credientials);

        this.pubnub.subscribe({ channels: [Object.values(CHANNELS)] });
        this.pubnub.addListener(this.listener());
    }

    listener() {
        return {
            message: messageObject => {
                const { channel, message } = messageObject;
                console.log(`Message received. Channel: ${channel}, message: ${message}`);
                
                const parsedMessage = JSON.parse(message);

                if (channel === CHANNELS.BLOCKCHAIN) {
                    this.blockchain.replaceChain(parsedMessage);
                }
            }
        }
    }

    publish({ channel, message }) {
        this.pubnub.publish({ channel, message });
        console.log(`Message sent. Channel: ${channel}, message: ${message}`);
    }

    broadcastChain() {
        this.publish({
            channel: CHANNELS.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain)
        });
    }
}

// const testPubSub = new PubSub();
// testPubSub.publish({ channel: CHANNELS.TEST, message: 'hello' });

module.exports = PubSub;