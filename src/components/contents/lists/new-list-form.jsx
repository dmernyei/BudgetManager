import React, { Component } from 'react'
import { observer } from 'mobx-react'
import DataComponent from '../../data-component'
import Header from '../../header'


@observer(['state'])
export default class NewListForm extends DataComponent {
    name = ""
    
    onSubmit(e) {
        if (e) 
            e.preventDefault()
        
        if (this.isDataValid())
            this.props.state.listState.addList(this.name)
    }


    isDataValid() {
        if ("" === this.name) {
            this.props.state.dialogState.showInfo("Error", "Please fill in the list name field.", "Ok")
            return false
        }
        return true
    }


    render() {
        const leftActionData = {
            wrap: true,
            GUI: "< Back",
            action: () => this.props.state.listState.setContextIndex(0)
        }
        
        const centerActionData = {
            wrap: true,
            GUI: "New list"
        }

        const rightActionData = {
            wrap: true,
            GUI: "Add",
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
                            <label className="control-label" htmlFor="inputName">List name (required)</label>
                            <input
                                type="text" className="form-control" id="inputName"
                                onChange={e => this.assignData("name", e.target.value)}
                                required
                            />
                        </div>
                    </fieldset>
                </form>
            </div>
        )
    }
}