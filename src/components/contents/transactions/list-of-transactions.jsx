import React, { Component } from 'react'
import { observer } from 'mobx-react'
import List from '../../list'
import TransactionPanel from './panels/transaction-panel'
import Header from '../../header'


@observer(['state'])
export default class ListOfTransactions extends Component {
    render() {
        const transactions = this.props.state.transactionState.transactions
        var panels = []
        transactions.forEach(transaction => panels.push(<TransactionPanel key={transaction.id} transaction={transaction} />))
        
        const leftActionData = {
            wrap: true,
            GUI: "< Back",
            action: () => this.props.state.transactionState.setContextIndex(0)
        }

        const centerActionData = {
            wrap: true,
            GUI: "Transaction history"
        }

        return (
            <div>
                <Header
                    leftActionData={leftActionData}
                    centerActionData={centerActionData}
                />
                <List panels={panels} />
            </div>
        )
    }
}