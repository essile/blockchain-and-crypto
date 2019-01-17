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
            <div>
                <h3>Blocks</h3>
                {
                    this.state.blocks.map(block => {
                        return (
                            <div>
                                <div key={block.hash}>Hash: {block.hash}</div>
                                <div key={block.timestamp}>Timestamp: {block.timestamp}</div>
                            </div>
                        )
                    })
                }
            </div>
        );
    }
}

export default Block;