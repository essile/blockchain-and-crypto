import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import TransactionData from './transactionData';

class Transactions extends Component {

    state = {
        walletAddressShortened: true,
        recipientAddressShortened: true,
        displayTransactions: false
    }

    toggleTransaction = () => {
        this.setState({ displayTransactions: !this.state.displayTransactions });
    }

    get displayTransactions() {
        const { data } = this.props.block;
        const stringifiedData = JSON.stringify(data);
        const transactionData = data.map((transaction, index) => (
            <TransactionData key={transaction.id} className="transaction" transaction={transaction} index={index} transactionCount={data.length-1} />
        ));

        return (
            <div>{transactionData}</div>
        );
    }

    render() {
        const buttonText = this.state.displayTransactions ? 'Hide transactions' : 'Show transactions';

        return (
            <div className="transaction-data">
                {this.displayTransactions.props.children.length > 0 &&
                    <span>Transaction data:</span>}
                {this.displayTransactions.props.children.length > 0 &&
                    <Button block id='toggle-button' onClick={this.toggleTransaction}>{buttonText}</Button>}
                {this.state.displayTransactions && this.displayTransactions}
            </div>
        );
    }
}

export default Transactions;