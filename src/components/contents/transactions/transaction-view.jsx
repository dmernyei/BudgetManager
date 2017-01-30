import React, { Component } from 'react'
import { observable, action } from 'mobx'
import { observer } from 'mobx-react'
import DataComponent from '../../data-component'
import Header from '../../header'


@observer(['state'])
export default class TransactionView extends DataComponent {
    
    @observable amount = ""
    @observable date = this.dateToString(new Date())
    @observable category = ""
    @observable description = ""
    
    isViewing = false


    constructor(props) {
        super(props)
        if (this.props.transaction)
            this.copyTransaction(this.props.transaction)
    }


    @action copyTransaction(transaction) {
        this.isViewing = true
        this.amount = transaction.amount
        this.date = this.dateToString(transaction.date)
        this.category = null === transaction.category ? "" : transaction.category
        this.description = null === transaction.description ? "" : transaction.description
    }
    

    onSubmit(e) {
        if (e)
            e.preventDefault()

        if (!this.isDataValid())
            return

        var transaction = {
            amount: Number(this.amount),
            date: this.stringToDate(this.date),
            category: this.category,
            description: this.description,
        }

        this.props.state.transactionState.addTransaction(transaction)
    }


    isDataValid() {
        if ("" === this.amount) {
            this.props.state.dialogState.showInfo("Error", "Please fill in the amount field.", "Ok")
            return false
        }

        var amountNumber = Number(this.amount)
        if (isNaN(amountNumber)) {
            this.props.state.dialogState.showInfo("Error", "The amount has to be a number.", "Ok")
            return false
        }

        if (0 === amountNumber) {
            this.props.state.dialogState.showInfo("Error", "The amount has to be nonzero.", "Ok")
            return false
        }

        if ("" === this.date) {
            this.props.state.dialogState.showInfo("Error", "Please fill in the date field.", "Ok")
            return false
        }

        var dateStrings = this.date.split("-")
        if (3 !== dateStrings.length) {
            this.props.state.dialogState.showInfo("Error", "The date has to have a format of YYYY-MM-DD.", "Ok")
            return false
        }
        else {
            if (4 !== dateStrings[0].length) {
                this.props.state.dialogState.showInfo("Error", "The year of the date has to be a 4-digit number.", "Ok")
                return false
            }
            
            var monthNumber = Number(dateStrings[1])
            if (1 > monthNumber || 12 < monthNumber) {
                this.props.state.dialogState.showInfo("Error", "The month of the date has to be at least 1, at most 12.", "Ok")
                return false
            }

            var dateNumber = Number(dateStrings[2])
            if (1 > dateNumber || 31 < dateNumber) {
                this.props.state.dialogState.showInfo("Error", "The date of the date has to be at least 1, at most 31.", "Ok")
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
        var header
        const leftActionData = {
            wrap: true,
            GUI: "< Back",
            action: () => this.props.state.transactionState.setContextIndex(this.isViewing ? 2 : 0)
        }
        
        const centerActionData = {
            wrap: true,
            GUI: this.isViewing ? "Details" : "New transaction",
        }

        if (this.isViewing) {
            header = 
            <Header
                leftActionData={leftActionData}
                centerActionData={centerActionData}
            />
        }
        else {
            const rightActionData = {
                wrap: true,
                GUI: "Add",
                action: () => this.onSubmit()
            }

            header = 
            <Header
                leftActionData={leftActionData}
                centerActionData={centerActionData}
                rightActionData={rightActionData}
            />
        }

        return(
            <div>
                {header}
                <form onSubmit={e => this.onSubmit(e)} className="form-horizontal">
                    <fieldset>
                        <div className="col-lg-10">
                            <label className="control-label" htmlFor="inputAmount">Amount{this.isViewing ? "" : " (required, has to be nonzero)"}</label>
                            <input
                                type="text" className="form-control" id="inputAmount"
                                value={this.amount}
                                onChange={e => this.assignData("amount", e.target.value)}
                                disabled={this.isViewing}
                                required
                            />
                        </div>
                        <div className="col-lg-10">
                            <label htmlFor="inputDate" className="control-label">Date{this.isViewing ? "" : " (required, format: YYYY-MM-DD)"}</label>
                            <input
                                type="text" className="form-control" id="inputDate"
                                value={this.date}
                                onChange={e => this.assignData("date", e.target.value)}
                                disabled={this.isViewing}
                                required
                            />
                        </div>
                        <div className="col-lg-10">
                            <label htmlFor="inputCategory" className="control-label">Category</label>
                            <input
                                type="text" className="form-control" id="inputCategory"
                                value={this.category}
                                onChange={e => this.assignData("category", e.target.value)}
                                disabled={this.isViewing}
                            />
                        </div>
                        <div className="col-lg-10">
                            <label htmlFor="description" className="control-label">Description</label>
                            <textarea
                                className="form-control"
                                rows="3"
                                id="description"
                                value={this.description}
                                onChange={e => this.assignData("description", e.target.value)}
                                disabled={this.isViewing}
                            >
                            </textarea>
                        </div>
                    </fieldset>
                </form>
            </div>
        )
    }
}