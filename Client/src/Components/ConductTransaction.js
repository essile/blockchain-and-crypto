import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel, Button, Alert, Row, Col } from 'react-bootstrap';
import Axios from 'axios';

class ConductTransaction extends Component {
    state = {
        fieldErrorMessageVisible: false,
        connectionErrorMessageVisible: false,
        success: false
    };

    handleChange = event => {
        this.setState({ [event.target.id]: event.target.value });
        console.log(this.state);
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
        this.setState({ fieldErrorMessageVisible: false });

        if (this.state.recipient == undefined || this.state.amount == undefined) {
            this.setState({ fieldErrorMessageVisible: true });
        } else if (this.validateRecipient() == 'error' || this.validateAmount() == 'error') {
            this.setState({ fieldErrorMessageVisible: true });
        } else {
            const { recipient, amount } = this.state;

            Axios.post('api/transact', { recipient, amount })
                .then((response) => {
                    this.setState({ success: true });
                    console.log(response)
                })
                .catch((error) => {
                    this.setState({ connectionErrorMessageVisible: true });
                    console.log(error)
                });
        }
    }

    render() {
        return (
            <Col sm={10} md={8} lg={6} className='new-transaction container-fluid'>
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
                    </FormGroup>
                    {this.state.fieldErrorMessageVisible && <Alert>Please check the fields.</Alert>}
                    {this.state.connectionErrorMessageVisible && <Alert>Something went wrong. Try again later.</Alert>}
                    {this.state.success && <Alert>Success</Alert>}
                    <Button type='submit' onClick={this.conductTransaction}>Send</Button>
            </Col>
        );
    }
}

export default ConductTransaction;