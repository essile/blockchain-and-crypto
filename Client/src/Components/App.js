import React, { Component } from 'react';
import Axios from 'axios';
import Block from './Block';
import Musucoin from '../assets/Musucoin.png';

class App extends Component {
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

        this.componentDidMount
        return (
            <div className='container'>
                <div>
                    <img className='logo' src={Musucoin} />
                </div>
                <div className='container'>
                    Address: {address} <br />
                    Balance: {balance}
                </div>
                <Block />
            </div>
        );
    }
}

export default App;