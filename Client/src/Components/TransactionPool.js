import React, { Component } from 'react';
import Axios from 'axios';
import { Col, Button } from 'react-bootstrap';

const FETCH_INTERVAL_MS = 10000;

class TransactionPool extends Component {

    state = {
        transactionPool: '',
    }

    componentDidMount() {
        this.fetchTransactionPoolMap();

        this.fetchInterval = setInterval(
            () => this.fetchTransactionPoolMap(), FETCH_INTERVAL_MS
        );
    }

    fetchTransactionPoolMap = () => {
        Axios.get(`${document.location.origin}/api/transaction-pool-map`)
            .then(response => {
                // console.log(response)
                this.setState({ transactionPool: response.data })
            })
            .catch(error => {
                console.log(error)
            })
    }

    mineTransactions = () => {
        Axios.get(`${document.location.origin}/api/mine-transactions`)
            .then(response => {
                console.log(response)
                alert('succeedeed');
            })
            .catch(error => {
                console.log(error);
            })
    }

    componentWillUnmount() {
        clearInterval(this.fetchInterval);
    }

    get renderTransactions() {
        return (
            Object.values(this.state.transactionPool).map(transaction => {
                return (
                    Object.entries(transaction.outputMap).map(recipient => {
                        const recipientAddress = recipient[0];
                        const amount = recipient[1];

                        return (
                            <div key={recipient[0]} className='block padding'>
                                <span>Timestamp: </span>
                                <span>{new Date(transaction.input.timestamp).toLocaleString()}</span><br />
                                <span></span>
                                <span>From:</span><br />
                                <span>{transaction.input.address}</span><br />
                                <span>To:</span><br />
                                <span>{recipientAddress}</span><br />
                                <span>Amount: </span>
                                <span>{amount}</span>
                            </div>
                        )
                    })
                )
            })
        )
    }

    render() {
        return (
            <Col sm={10} md={8} lg={6} className='centered container-fluid'>
                <h4>Transactions waiting to be mined to a block</h4>
                {Object.keys(this.state.transactionPool).length == 0 ? <div>No new transactions</div> : this.renderTransactions}
                <Button onClick={this.mineTransactions}>Mine</Button>
            </Col>
        );
    }
}

export default TransactionPool;