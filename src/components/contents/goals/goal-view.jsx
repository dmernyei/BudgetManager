import React, { Component } from 'react'
import { observable, action } from 'mobx'
import { observer } from 'mobx-react'
import DataComponent from '../../data-component'
import Header from '../../header'


@observer(['state'])
export default class GoalView extends DataComponent {
    
    @observable name = ""
    @observable goalamount = ""
    @observable deadline = this.dateToString(new Date())
    @observable priority = 0
    @observable description = ""
    
    isEditing = false
    
    id = ""
    allocatedamount = 0
    user = null


    constructor(props) {
        super(props)
        if (this.props.goal)
            this.copyGoal(this.props.goal)
    }


    @action copyGoal(goal) {
        this.isEditing = true
        this.id = goal.id
        this.allocatedamount = goal.allocatedamount
        this.user = goal.user

        if (this.props.state.goalState.isGoalFormDataSet) {
            const formData = this.props.state.goalState.goalFormData
            this.name = formData.name
            this.goalamount = formData.goalamount
            this.deadline = formData.deadline
            this.priority = formData.priority
            this.description = formData.description
        }
        else {
            this.name = goal.name
            this.goalamount = goal.goalamount
            this.deadline = this.dateToString(goal.deadline)
            this.priority = goal.priority
            this.description = null === goal.description ? "" : goal.description
        }
    }
    

    onAddAmountClicked(e) {
        e.preventDefault()
        this.setFormData()
        this.props.state.goalState.setAddingAmount(true)
        this.props.state.goalState.setContextIndex(3)
    }
    
    
    onSubtractAmountClicked(e) {
        e.preventDefault()
        this.setFormData()
        this.props.state.goalState.setAddingAmount(false)
        this.props.state.goalState.setContextIndex(3)
    }


    setFormData() {
        const formData = {
            name: this.name,
            goalamount: this.goalamount,
            deadline: this.deadline,
            priority: this.priority,
            description: this.description
        }
        
        this.props.state.goalState.setGoalFormDataSet(true)
        this.props.state.goalState.setGoalFormData(formData)
    }


    onDeleteGoalClicked(e) {
        e.preventDefault()
        this.props.state.dialogState.showQuestion(
            () => this.props.state.goalState.deleteSelectedGoal(),
            "Are you sure?",
            "You will not be able to restore this goal. The allocated amount will be added back to your liquid balance.",
            "Delete",
            "Cancel"
        )
    }


    onSubmit(e) {
        if (e)
            e.preventDefault()

        if (!this.isDataValid())
            return

        var goal = {
            id: this.id,
            name: this.name,
            goalamount: Number(this.goalamount),
            allocatedamount: this.allocatedamount,
            deadline: this.stringToDate(this.deadline),
            priority: Number(this.priority),
            description: this.description,
            user: this.user
        }

        if (this.isEditing)
            this.props.state.goalState.updateGoal(goal)
        else
            this.props.state.goalState.addGoal(goal)
    }


    isDataValid() {
        if ("" === this.name) {
            this.props.state.dialogState.showInfo("Error", "Please fill in the name field.", "Ok")
            return false
        }

        if ("" === this.goalamount) {
            this.props.state.dialogState.showInfo("Error", "Please fill in the goal amount field.", "Ok")
            return false
        }

        var goalAmountNumber = Number(this.goalamount)
        if (isNaN(goalAmountNumber)) {
            this.props.state.dialogState.showInfo("Error", "The goal amount has to be a number.", "Ok")
            return false
        }

        if (0 >= goalAmountNumber) {
            this.props.state.dialogState.showInfo("Error", "The goal amount has to be greater than zero.", "Ok")
            return false
        }

        if ("" === this.deadline) {
            this.props.state.dialogState.showInfo("Error", "Please fill in the deadline field.", "Ok")
            return false
        }

        var dateStrings = this.deadline.split("-")
        if (3 !== dateStrings.length) {
            this.props.state.dialogState.showInfo("Error", "The deadline has to have a format of YYYY-MM-DD.", "Ok")
            return false
        }
        else {
            if (4 !== dateStrings[0].length) {
                this.props.state.dialogState.showInfo("Error", "The year of the deadline has to be a 4-digit number.", "Ok")
                return false
            }
            
            var monthNumber = Number(dateStrings[1])
            if (1 > monthNumber || 12 < monthNumber) {
                this.props.state.dialogState.showInfo("Error", "The month of the deadline has to be at least 1, at most 12.", "Ok")
                return false
            }

            var dateNumber = Number(dateStrings[2])
            if (1 > dateNumber || 31 < dateNumber) {
                this.props.state.dialogState.showInfo("Error", "The date of the deadline has to be at least 1, at most 31.", "Ok")
                return false
            }
        }
        
        return true
    }


    dateToString(date) {
        return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    }


    stringToDate(dateString) {
        var dateStrings = dateString.split("-")
        var date = new Date()
        
        date.setDate(Number(dateStrings[2]))
        date.setMonth(Number(dateStrings[1]) - 1)
        date.setFullYear(Number(dateStrings[0]))

        return date
    }


    render() {
        const leftActionData = {
            wrap: true,
            GUI: "< Back",
            action: () => this.props.state.goalState.setContextIndex(0)
        }
        
        const centerActionData = {
            wrap: true,
            GUI: this.isEditing ? "Details" : "New goal",
        }

        const rightActionData = {
            wrap: true,
            GUI: this.isEditing ? "Done" : "Add",
            action: () => this.onSubmit()
        }

        var allocatedAmountPanel
        if (this.isEditing) {
            allocatedAmountPanel = 
            <div className="col-lg-10">
                <label className="control-label" htmlFor="labelAllocatedAmount">Allocated amount: {this.allocatedamount} Ft</label>
            </div>
        }

        var changingAmountPanel
        if (this.props.state.goalState.changingAmount) {
            var deltaAmount = this.props.state.goalState.deltaAmount
            var adding = this.props.state.goalState.addingAmount
            changingAmountPanel =
            <div className="col-lg-10">
                <label className="control-label" htmlFor="labelChangingAmount">To be {adding ? "added" : "subtracted"}: {deltaAmount} Ft</label>
            </div>
        }
        
        var operationButtonsHolder
        if (this.isEditing) {
            var operationButtons = []
            if (0 < this.props.state.userState.userLiquidBalance) {
                operationButtons.push(
                    <div key="0" className="col-lg-10 operationLinkHolderFirst">
                        <a onClick={e => this.onAddAmountClicked(e)} href="">Add amount</a>
                    </div>
                )
            }
            if (0 < this.allocatedamount) {
                operationButtons.push(
                    <div key="1" className={0 < operationButtons.length ? "col-lg-10 operationLinkHolder" : "col-lg-10 operationLinkHolderFirst"}>
                        <a onClick={e => this.onSubtractAmountClicked(e)} href="">Subtract amount</a>
                    </div>
                )
            }
            operationButtons.push(
                <div key="2" className="col-lg-10 operationLinkHolderFirst">
                    <a className="deleteLinkDetails" onClick={e => this.onDeleteGoalClicked(e)} href="">Delete goal</a>
                </div>
            )

            operationButtonsHolder = 
            <div>
                {operationButtons}
            </div>
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
                            <label className="control-label" htmlFor="inputName">Goal name (required)</label>
                            <input
                                type="text" className="form-control" id="inputName"
                                value={this.name}
                                onChange={e => this.assignData("name", e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-lg-10">
                            <label className="control-label" htmlFor="inputGoalAmount">Goal amount (required, has to be a positive number)</label>
                            <input
                                type="text" className="form-control" id="inputGoalAmount"
                                value={this.goalamount}
                                onChange={e => this.assignData("goalamount", e.target.value)}
                                required
                            />
                        </div>
                        {allocatedAmountPanel}
                        {changingAmountPanel}
                        <div className="col-lg-10">
                            <label className="control-label" htmlFor="inputDeadline">Deadline (required, format: YYYY-MM-DD)</label>
                            <input
                                type="text" className="form-control" id="inputDeadline"
                                value={this.deadline}
                                onChange={e => this.assignData("deadline", e.target.value)}
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
                        {operationButtonsHolder}
                    </fieldset>
                </form>
            </div>
        )
    }
}