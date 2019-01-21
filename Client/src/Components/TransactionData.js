import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

class TransactionData extends Component {
    state = {
        walletAddressShortened: true,
        recipientAddressShortened: true,
    }

    toggleWalletAddressLength = () => {
        this.setState({ walletAddressShortened: !this.state.walletAddressShortened })
    }
    toggleRecipientAddressLength = () => {
        this.setState({ recipientAddressShortened: !this.state.recipientAddressShortened })
    }

    render() {
        const transaction = this.props.transaction;
        var walletPublicAddress = this.state.walletAddressShortened ? `${transaction.input.address.substring(0, 22)}` : `${transaction.input.address}`;

        const recipients = Object.keys(transaction.outputMap);
        const recipientPublicAddress = this.state.recipientAddressShortened ? `${recipients[0].substring(0, 22)}...` : `${recipients[0]}`;

        const walletButtonText = this.state.walletAddressShortened ? `Show full address` : `Show less`;
        const recipientButtonText = this.state.recipientAddressShortened ? `Show full address` : `Show less`;

        console.log(this.props.index + "/" + this.props.transactionCount);
        return (
            <div className="transaction">
                {recipients.length !== 1 &&
                    <span>Wallet address: <br /></span>}
                    <span>{walletPublicAddress}{(walletPublicAddress.length > 21 && walletPublicAddress.length < 130) && "..."}</span>

                {walletPublicAddress.length > 21 && 
                    <span><br /><Button bsSize="xs" onClick={this.toggleWalletAddressLength}>{walletButtonText}</Button></span>} <br />

                {recipients.length !== 1 && 
                <span className="wallet-balance">Balance: {transaction.input.amount}<br /></span>}<br />

                <span>{transaction.outputMap[recipients[0]]} sent to: <br /></span>
                <span>{recipientPublicAddress} <br /></span>
                <span><Button bsSize="xs" onClick={this.toggleRecipientAddressLength}>{recipientButtonText}</Button> <br /></span>

                <span className="wallet-balance">{recipients.length !== 1 && "Balance left: "}{transaction.outputMap[recipients[1]]}</span>
                {this.props.index != this.props.transactionCount && <hr />}
            </div>
        );
    }
}

export default TransactionData;