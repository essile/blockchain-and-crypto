import React from 'react';
import { render } from 'react-dom';
import { Router, Switch, Route } from 'react-router-dom';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import Musucoin from './assets/Musucoin.png';
import history from './history';
import App from './Components/App';
import './index.css';
import Blocks from './Components/Blocks';
import WalletDetails from './components/WalletDetails';
import ConductTransaction from './components/ConductTransaction';
import TransactionPool from './components/TransactionPool';

render(
    <Router history={history}>
        <div>
            <Navbar collapseOnSelect>
                <Navbar.Toggle />
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href="/"><img className='logo' src={Musucoin} /></a>
                    </Navbar.Brand>
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav pullRight>
                        <NavItem href="/wallet-details">Wallet details</NavItem>
                        <NavItem href="/new-transaction">Make a transaction</NavItem>
                        <NavItem href="/transaction-pool">Transaction pool</NavItem>
                        <NavItem href="/blocks">Blockchain</NavItem>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            <Switch>
                <Route path='/blocks' component={Blocks} />
                <Route path='/wallet-details' component={WalletDetails} />
                <Route path='/new-transaction' component={ConductTransaction} />
                <Route path='/transaction-pool' component={TransactionPool} />
                <Route exact path='/' component={App} />
            </Switch>
        </div>
    </Router>,
    document.getElementById('root')
);