import React, { Component } from 'react'
import { observer } from 'mobx-react'


@observer(['state'])
export default class ListPanel extends Component {
    render() {
        return (
            <div className="rootPanel" onClick={e => this.props.state.listState.onListSelected(this.props.listId)}>
                <div className="listPanelDetailsHolder">
                    <div className="listPanelDetails">
                        <h4>{this.props.listName}</h4>
                    </div>
                </div>
                <hr />
            </div>
        )
    }
}