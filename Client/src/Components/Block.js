import React, { Component } from 'react';
import Axios from 'axios';

class Block extends Component {

    state = {
        blocks: []
    }

    componentDidMount() {
        Axios.get('/api/blocks')
            .then(response => {
                this.setState({ blocks: response.data });
                console.log(this.state)
            });
    }

    render() {
        return (
            <div className='container'>
                <h3>Blocks</h3>
                {
                    this.state.blocks.map(block => {
                        return (
                            <div className='block'>
                                <div key={block.hash}>
                                    Hash: {block.hash} <br />
                                    Timestamp: {block.timestamp}<br />
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        );
    }
}

export default Block;