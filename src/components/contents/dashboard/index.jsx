import React, { Component } from 'react'
import { observer } from 'mobx-react'

@observer(['state'])
export default class Dashboard extends Component {
    
    clicked() {
        this.props.state.dialogState.show(() => console.log("deleted!"), "You will not be able to restore this item.", "Delete", "Cancel")
    }

    render() {
        return(
            <div>
                <p>dashboard</p>
                <button onClick={e => this.clicked()} type='button'>Delete</button>
            </div>
        )
    }
}