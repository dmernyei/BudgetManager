import React, { Component } from 'react'
import { observer } from 'mobx-react'
import Menu from '../menu'
import Dashboard from '../contents/dashboard'
import Goals from '../contents/goals'
import Lists from '../contents/lists'
import Transactions from '../contents/transactions'
import AccountView from '../contents/account'


@observer(['state'])
export default class LoggedInUI extends Component {
    
    render() {
        const menuId = this.props.state.menuId
        var content
        switch(menuId) {
            case 1:
                this.props.state.listState.resetState()
                content = <Lists />
                break
            case 2:
                content = <Goals />
                this.props.state.goalState.resetState()
                break
            case 3:
                content = <Transactions />
                this.props.state.transactionState.resetState()
                break
            case 4:
                this.props.state.userState.setUserRejectionIndex(-1)
                content = <AccountView />
                break
            default:
                content = <Dashboard />
                break
        }

        return(
            <div>
                <Menu />
                {content}
            </div>
        )
    }
}