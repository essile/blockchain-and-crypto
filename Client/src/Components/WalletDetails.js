import React, { Component } from 'react';
import Axios from 'axios';

class WalletDetails extends Component {
    state = {
        walletInfo: {},
        isLoading: true
    }

    componentDidMount() {
        this.setState({ isLoading: true });
        Axios.get('/api/wallet-info')
            .then(response => {
                this.setState({ walletInfo: response.data, isLoading: false });
                console.log(response);
            })
            .catch(error => {
                console.log(error);
            });
    }

    render() {
        const { address, balance } = this.state.walletInfo;

        return (
            <div className='container'>
                <h3>Your wallet details</h3>
                <div>
                    <span>Address:</span><br />
                    <span>{this.state.isLoading ? '...' : address}</span>
                </div>
                <br />
                <div>
                    <span>Balance: </span>
                    <span>{this.state.isLoading ? '...' : balance}</span>
                </div>
            </div>
        );
    }
}

export default WalletDetails;