import React, { Component } from 'react'
import { observer } from 'mobx-react'
import Header from '../../header'


@observer(['state'])
export default class TransactionsMain extends Component {
    
    onNewTransactionClicked(e) {
        e.preventDefault()
        this.props.state.transactionState.setContextIndex(1)
    }


    onTransactionHistoryClicked(e) {
        e.preventDefault()
        this.props.state.transactionState.setContextIndex(2)
        this.props.state.transactionState.queryTransactions()
    }


    render() {
        const centerActionData = {
            wrap: true,
            GUI: "Transactions"
        }

        return (
            <div>
                <Header centerActionData={centerActionData} />
                <div className="transactionsMainContentHolder">
                    <form className="form-horizontal">
                        <fieldset>
                            <div className="col-lg-10">
                                <div className="btn-group btn-group-justified">
                                    <a onClick={e => this.onNewTransactionClicked(e)} href="" className="btn btn-primary btn-lg">New transaction</a>
                                    <a onClick={e => this.onTransactionHistoryClicked(e)} href="" className="btn btn-primary btn-lg">Transaction history</a>
                                </div>
                            </div>
                        </fieldset>
                    </form>
                </div>
            </div>
        )
    }
}