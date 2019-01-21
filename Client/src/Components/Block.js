import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import Transactions from './Transactions';
import TransactionData from './transactionData';
import { Grid, Row, Col, } from 'react-bootstrap';

class Block extends Component {

    state = {
        displayTransactions: false,
    }

    render() {
        const { timestamp, hash } = this.props.block;
        const shorterHashToDisplay = `${hash.substring(0, 15)}...`;

        return (
            <Row className='block-row'>
                <Col md={4} className='block-details'>
                    <h4>BLOCK {this.props.index}</h4>
                    <span>Hash: {shorterHashToDisplay} <br /></span>
                    <span>Timestamp: {new Date(timestamp).toLocaleString()} <br /></span>
                </Col>
                <Col md={6} className='block-transactions'>
                    <Transactions block={this.props.block} />
                </Col>
            </Row>
        );
    }
}

export default Block;