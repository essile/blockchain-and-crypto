import React, { Component } from 'react';
import Axios from 'axios';
import Block from './Block';

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
            <div>
                <div>App component</div>
                <div>Address: {address}</div>
                <div>Balance: {balance}</div>
                <Block />
            </div>
        );
    }
}

export default App;