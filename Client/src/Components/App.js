import React, { Component } from 'react';
import Axios from 'axios';
import Blocks from './Blocks';
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

        return (
            <div className="page">
                <img className='logo' src={Musucoin} />
                {/* <div className='container'>
                    Address: {address} <br />
                    Balance: {balance}
                </div> */}
                <Blocks />
            </div>
        );
    }
}

export default App;