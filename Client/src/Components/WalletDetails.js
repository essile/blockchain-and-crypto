import React, { Component } from 'react';
import Axios from 'axios';

class WalletDetails extends Component {
    state = { walletInfo: {} }

    componentDidMount() {
        Axios.get('/api/wallet-info')
            .then(response => {
                this.setState({ walletInfo: response.data });
                //console.log(this.state);                
            });
    }

    render() {
        const { address, balance } = this.state.walletInfo;

        return (
            <div>
                <div className='container'>
                    Address: {address} <br />
                    Balance: {balance}
                </div>
            </div>
        );
    }
}

export default WalletDetails;