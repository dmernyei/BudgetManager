import React, { Component } from 'react'
import { observable, action } from 'mobx'
import { observer } from 'mobx-react'
import DataComponent from '../../data-component'
import List from '../../list'
import ListItemPanel from './panels/list-item-panel'
import Header from '../../header'


@observer(['state'])
export default class ListContentView extends DataComponent {
    
    @observable listName


    constructor(props) {
        super(props)
        this.assignData("listName", this.props.state.listState.selectedList.name)
    }


    onSubmit() {
        if (!this.isDataValid())
            return

        this.props.state.listState.updateSelectedListName(this.listName)
    }


    isDataValid() {
        return "" !== this.listName
    }


    onDeleteButtonPressed(e) {
        e.preventDefault()
        this.props.state.dialogState.showQuestion(() => this.props.state.listState.deleteSelectedList(), "Are you sure?", "You will not be able to restore this list.", "Delete", "Cancel")
    }


    render() {
        const selectedList = this.props.state.listState.selectedList
        const listItems = this.props.state.listState.listItems
        
        const panels = this.createPanels(listItems)

        if (this.props.isEditing)
            return this.createEditor(selectedList, panels)
        else
            return this.createView(selectedList, panels)
    }


    createPanels(listItems) {
        var panels = []
        listItems.forEach(listItem => panels.push(<ListItemPanel key={listItem.id} listItem={listItem} isDeletable={this.props.isEditing} />))
        return panels
    }


    createView(selectedList, panels) {
        const leftActionData = {
            wrap: true,
            GUI: "< Back",
            action: () => this.props.state.listState.setContextIndex(0)
        }

        const centerActionData = {
            wrap: true,
            GUI: selectedList.name
        }

        const rightActionData = {
            wrap: true,
            GUI: "Edit",
            action: () => this.props.state.listState.setContextIndex(3)
        }

        return (
            <div>
                <Header leftActionData={leftActionData} centerActionData={centerActionData} rightActionData={rightActionData} />
                <List panels={panels} />
                <div className="rootPanel">
                    <button className="btn btn-danger addButton" onClick={e => this.props.state.listState.setContextIndex(5)}><h2>+</h2></button>
                </div>
            </div>
        )
    }
    

    createEditor(selectedList, panels) {
        var nameField =
        <input
            type="text" className="form-control input-sm" id="inputName" placeholder="List name (required)"
            value={this.listName}
            onChange={e => this.assignData("listName", e.target.value)}
            required
        />
        
        const centerActionData = {
            wrap: false,
            GUI: nameField
        }

        const rightActionData = {
            wrap: true,
            GUI: "Done",
            action: () => this.onSubmit()
        }

        return (
            <div>
                <Header centerActionData={centerActionData} rightActionData={rightActionData} />
                <List panels={panels} />
                <div className="rootPanel">
                    <a className="deleteLinkEndOfList" href="" onClick={e => this.onDeleteButtonPressed(e)}>Delete list</a>
                </div>
            </div>
        )
    }
}