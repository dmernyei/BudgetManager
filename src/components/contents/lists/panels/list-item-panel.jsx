import React, { Component } from 'react'
import { observable, action } from 'mobx'
import { observer } from 'mobx-react'
import DataComponent from '../../../data-component'


@observer(['state'])
export default class ListItemPanel extends DataComponent {
    
    @observable isdone


    constructor(props) {
        super(props)
        this.assignData("isdone", this.props.listItem.isdone)
    }


    @action onCheckboxClicked(e) {
        this.assignData("isdone", e.target.checked)
        this.props.listItem.isdone = this.isdone
        this.props.state.listState.updateListItem(this.props.listItem, true)
    }
    

    onDetailsClicked(e) {
        e.preventDefault()
        this.props.state.listState.selectListItem(this.props.listItem.id)
    }
    

    onDeleteClicked(e) {
        e.preventDefault()
        this.props.state.listState.deleteListItem(this.props.listItem, false)
    }


    render() {
        var priority
        switch (this.props.listItem.priority) {
            case 1:
                priority = <p className="text-danger p-listItemPriority">!</p>
                break;
            case 2:
                priority = <p className="text-danger p-listItemPriority">!!</p>
                break;
            case 3:
                priority = <p className="text-danger p-listItemPriority">!!!</p>
                break;
            default:   // 0
                priority = <p className="text-danger p-listItemPriority">&nbsp;</p>
                break;
        }
        
        if (this.props.isDeletable)
            return this.createDeletableView(priority)
        else
            return this.createView(priority)
    }


    createView(priority) {
        return (
            <div className="rootPanel">
                <div className="panelDetailsHolder">
                    <div className="listItemPanelCheckBox">
                        <input
                            type="checkbox"
                            checked={this.isdone}
                            onChange={e => this.onCheckboxClicked(e)}
                        />
                    </div>
                    <div className="listItemPanelName">
                        {this.props.listItem.name}
                    </div>
                    <div className="listItemPanelPriority">
                        {priority}
                    </div>
                    <div className="listItemPanelDetails">
                        <a href="" onClick={e => this.onDetailsClicked(e)}>Details</a>
                    </div>
                </div>
                <hr />
            </div>
        )
    }


    createDeletableView(priority) {
        return (
            <div className="rootPanel">
                <div className="panelDetailsHolder">
                    <div className="listItemPanelNameDeletable">
                        {this.props.listItem.name}
                    </div>
                    <div className="listItemPanelPriorityDeletable">
                        {priority}
                    </div>
                    <div className="listItemPanelDelete">
                        <a className="deleteLink" href="" onClick={e => this.onDeleteClicked(e)}>Delete</a>
                    </div>
                </div>
                <hr />
            </div>
        )
    }
}