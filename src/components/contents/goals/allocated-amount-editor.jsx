import React, { Component } from 'react'
import { observable, action } from 'mobx'
import { observer } from 'mobx-react'
import DataComponent from '../../data-component'
import Header from '../../header'


@observer(['state'])
export default class AllocatedAmountEditor extends DataComponent {
    
    amount = ""
    addingAmount = this.props.state.goalState.addingAmount
    goal = this.props.state.goalState.selectedGoal
    liquidBalance = this.props.state.userState.userLiquidBalance


    onSubmit(e) {
        if (e) 
            e.preventDefault()
        
        if (!this.isDataValid())
            return
        
        this.props.state.goalState.setChangingAmount(true)
        this.props.state.goalState.setDeltaAmount(Number(this.amount))
        this.props.state.goalState.setContextIndex(1)
    }


    isDataValid() {
        if (0 === this.amount.length) {
            this.props.state.dialogState.showInfo("Error", "Please fill in the amount field.", "Ok")
            return false
        }
        
        var amountNumber = Number(this.amount)

        if (isNaN(amountNumber)) {
            this.props.state.dialogState.showInfo("Error", "The amount has to be a number.", "Ok")
            return false
        }
        
        if (0 >= amountNumber) {
            this.props.state.dialogState.showInfo("Error", "The amount has to be greater than zero.", "Ok")
            return false
        }

        if (this.addingAmount && this.liquidBalance < amountNumber) {
            this.props.state.dialogState.showInfo("Error", "You cannot add more than your liquid balance.", "Ok")
            return false
        }
        else if (!this.addingAmount && this.goal.allocatedamount < amountNumber) {
            this.props.state.dialogState.showInfo("Error", "You cannot subtract more than the allocated amount.", "Ok")
            return false
        }

        return true
    }


    render() {
        const leftActionData = {
            wrap: true,
            GUI: "< Back",
            action: () => this.props.state.goalState.setContextIndex(1)
        }

        const centerActionData = {
            wrap: true,
            GUI: this.addingAmount ? "Adding amount" : "Subtracting amount"
        }

        const rightActionData = {
            wrap: true,
            GUI: "Done",
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
                            <label className="control-label" htmlFor="inputAmount">
                                {this.addingAmount ? "Increase" : "Decrease"} by (required, has to be a positive number)
                            </label>
                            <input
                                type="text" className="form-control" id="inputAmount"
                                onChange={e => this.assignData("amount", e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-lg-10">
                            <label className="control-label" htmlFor="goalName">Goal name: {this.goal.name}</label>
                        </div>
                        <div className="col-lg-10">
                            <label className="control-label" htmlFor="goalAmount">Goal amount: {this.goal.goalamount} Ft</label>
                        </div>
                        <div className="col-lg-10">
                            <label className="control-label" htmlFor="allocatedAmount">Allocated amount: {this.goal.allocatedamount} Ft</label>
                        </div>
                        <div className="col-lg-10">
                            <label className="control-label" htmlFor="liquidBalance">Liquid balance: {this.liquidBalance} Ft</label>
                        </div>
                    </fieldset>
                </form>
            </div>
        )
    }
}