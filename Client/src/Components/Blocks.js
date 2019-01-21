import React, { Component } from 'react';
import { Grid } from 'react-bootstrap';
import Axios from 'axios';
import Block from './Block';

class Blocks extends Component {

    state = {
        blocks: []
    }

    componentDidMount() {
        Axios.get('/api/blocks')
            .then(response => {
                this.setState({ blocks: response.data });
            });
    }

    render() {
        return (
            <Grid className="blockchain">
                    <h3>BLOCKCHAIN</h3>
                    {
                        this.state.blocks.map((block, index) => {
                            return (
                                <div key={block.hash} className='block'>
                                    <Block block={block} index={index} />
                                </div>
                            )
                        })
                    }
            </Grid>
        );
    }
}

export default Blocks;