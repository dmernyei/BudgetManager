import React, { Component } from 'react'


export default class List extends Component {
    render() {
        if (0 < this.props.panels.length) {
            return(
                <div>{this.props.panels}</div>
            )
        }
        else {
            return (
                <div className="emptyLabelHolder">
                    <h4>No items available</h4>
                </div>
            )
        }
    }
}