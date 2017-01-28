import React, { Component } from 'react'
import { observer } from 'mobx-react'
import List from '../../list'
import ListPanel from '../../list/panels/list-panel'
import Header from '../../header'


@observer(['state'])
export default class ListOfLists extends Component {
    render() {
        const lists = this.props.state.listState.lists
        var panels = []
        lists.forEach(list => panels.push(<ListPanel key={list.id} listId={list.id} listName={list.name} />))
        
        const centerActionData = {
            wrap: true,
            GUI: "Lists"
        }

        return (
            <div>
                <Header centerActionData={centerActionData} />
                <List panels={panels} />
                <div className="rootPanel">
                    <button className="btn btn-danger addButton" onClick={e => this.props.state.listState.setContextIndex(1)}><h2>+</h2></button>
                </div>
            </div>
        )
    }
}