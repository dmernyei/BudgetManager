import React, { Component } from 'react'
import { observer } from 'mobx-react'
import TransactionsMain from './transactions-main'
import ListOfTransactions from './list-of-transactions'
import TransactionView from './transaction-view'


@observer(['state'])
export default class Transactions extends Component {
    
    render() {
        var content

        switch(this.props.state.transactionState.context) {
            case "new-transaction":
                content = <TransactionView />
                break;
            case "list-of-transactions":
                content = <ListOfTransactions />
                break;
            case "transaction-view":
                content = <TransactionView transaction={this.props.state.transactionState.selectedTransaction} />
                break;
            default:   // main-page
                content = <TransactionsMain />
                break;
        }

        return(
            <div>
                {content}
            </div>
        )
    }
}