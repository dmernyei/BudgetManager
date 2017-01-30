import React, { Component } from 'react'
import { observable, action } from 'mobx'
import { observer } from 'mobx-react'
import DataComponent from '../../data-component'
import Header from '../../header'


@observer(['state'])
export default class ListItemView extends DataComponent {
    
    @observable name = ""
    @observable priority = 0
    @observable description = ""
    
    isEditing = false
    
    id = ""
    isdone = false
    list = null


    constructor(props) {
        super(props)
        if (this.props.listItem)
            this.copyListItem(this.props.listItem)
    }


    @action copyListItem(listItem) {
        this.isEditing = true
        this.id = listItem.id
        this.isdone = listItem.isdone
        this.name = listItem.name
        this.priority = listItem.priority
        this.description = null === listItem.description ? "" : listItem.description
        this.list = listItem.list
    }
    

    onSubmit(e) {
        if (e)
            e.preventDefault()

        if (!this.isDataValid())
            return

        var listItem = {
            id: this.id,
            isdone: this.isdone,
            name: this.name,
            priority: Number(this.priority),
            description: this.description,
            list: this.list
        }

        if (this.isEditing)
            this.props.state.listState.updateListItem(listItem, false)
        else
            this.props.state.listState.addListItem(listItem)
    }


    isDataValid() {
        return "" !== this.name
    }


    render() {
        const leftActionData = {
            wrap: true,
            GUI: "< Back",
            action: () => this.props.state.listState.setContextIndex(2)
        }
        
        const centerActionData = {
            wrap: true,
            GUI: this.isEditing ? "Details" : "New list item",
        }

        const rightActionData = {
            wrap: true,
            GUI: this.isEditing ? "Done" : "Add",
            action: () => this.onSubmit()
        }

        return(
            <div>
                <Header
                    leftActionData={leftActionData}
                    centerActionData={centerActionData}
                    rightActionData={rightActionData}
                />
                <form onSubmit={e => this.onSubmit(e)} className="form-horizontal">
                    <fieldset>
                        <div className="col-lg-10">
                            <label className="control-label" htmlFor="inputName">List item name (required)</label>
                            <input
                                type="text" className="form-control" id="inputName"
                                value={this.name}
                                onChange={e => this.assignData("name", e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-lg-10">
                            <label htmlFor="priority" className="control-label">Priority</label>
                            <select
                                className="form-control"
                                id="priority"
                                value={this.priority}
                                onChange={e => this.assignData("priority", e.target.value)}
                            >
                                <option>0</option>
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                            </select>
                        </div>
                        <div className="col-lg-10">
                            <label htmlFor="description" className="control-label">Description</label>
                            <textarea
                                className="form-control"
                                rows="3"
                                id="description"
                                value={this.description}
                                onChange={e => this.assignData("description", e.target.value)}
                            >
                            </textarea>
                        </div>
                    </fieldset>
                </form>
            </div>
        )
    }
}