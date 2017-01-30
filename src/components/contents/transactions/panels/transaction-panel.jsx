import React, { Component } from 'react'
import { observer } from 'mobx-react'


@observer(['state'])
export default class TransactionPanel extends Component {
    
    dateToString(date) {
        return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    }

    
    render() {
        return (
            <div className="rootPanel" onClick={e => this.props.state.transactionState.selectTransaction(this.props.transaction.id)}>
                <div className="panelDetailsHolder">
                    <div className="transactionPanelAmount">
                        <h4>{this.props.transaction.amount} Ft</h4>
                    </div>
                    <div className="transactionPanelDate">
                        {this.dateToString(this.props.transaction.date)}
                    </div>
                    <div className="transactionPanelCategory">
                        {this.props.transaction.category ? this.props.transaction.category : "N/A"}
                    </div>
                </div>
                <hr />
            </div>
        )
    }
}