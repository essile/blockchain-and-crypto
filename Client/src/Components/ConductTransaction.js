import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel, Button, Alert, Row, Col } from 'react-bootstrap';
import Axios from 'axios';
import history from '../history';

class ConductTransaction extends Component {
    state = {
        fieldErrorMessageVisible: false,
        connectionErrorMessageVisible: false,
        success: false,
        errorMessage: ""
    };

    handleChange = event => {
        this.setState({ [event.target.id]: event.target.value });
    }

    validateRecipient() {
        const addressLength = 130;
        if (this.state.recipient != undefined) {
            const length = this.state.recipient.length;
            if (length !== addressLength && length > 1) {
                return 'error';
            }
        }
    }
    validateAmount() {
        if (this.state.amount != undefined) {
            const amount = parseInt(this.state.amount);
            if (amount < 0) {
                return 'error';
            }
        }
    }

    conductTransaction = () => {
        this.setState({ fieldErrorMessageVisible: false, connectionErrorMessageVisible: false, success: false });

        if (this.state.recipient == undefined || this.state.amount == undefined) {
            this.setState({ fieldErrorMessageVisible: true });
        } else if (this.validateRecipient() == 'error' || this.validateAmount() == 'error') {
            this.setState({ fieldErrorMessageVisible: true });
        } else {
            const { recipient, amount } = this.state;

            Axios.post('api/transact', { recipient, amount })
                .then((response) => {
                    // this.setState({ success: true });
                    history.push('/transaction-pool');
                })
                .catch((error) => {
                    if (error.response != undefined) {
                        if (error.response.status == 400) {
                            this.setState({ errorMessage: error.response.data.message, connectionErrorMessageVisible: true });
                            return;
                        }
                    }
                    console.log(error);
                    this.setState({ errorMessage: "Something went wrong. Try again later.", connectionErrorMessageVisible: true });
                });
        }
    }

    render() {
        return (
            <Col sm={10} md={8} lg={6} className='centered container-fluid'>
                <h3>Conduct a transaction</h3>
                <FormGroup
                    controlId='recipient'
                    validationState={this.validateRecipient()}
                >
                    <ControlLabel>Recipient address</ControlLabel>
                    <FormControl required type='text' onChange={this.handleChange}></FormControl>
                </FormGroup>
                <FormGroup
                    controlId='amount'
                    validationState={this.validateAmount()}
                >
                    <ControlLabel>Amount</ControlLabel>
                    <FormControl required type='number' onChange={this.handleChange}></FormControl>
                </FormGroup><br />
                <Button block type='submit' onClick={this.conductTransaction}>Send</Button><br />
                {this.state.fieldErrorMessageVisible && <Alert>Please check the fields</Alert>}
                {this.state.connectionErrorMessageVisible && <Alert>{this.state.errorMessage}</Alert>}
                {this.state.success && <Alert>Transaction succeeded</Alert>}
            </Col>
        );
    }
}

export default ConductTransaction;