import React, { Component } from 'react'
import { observer } from 'mobx-react'
import Menu from '../menu'
import Dashboard from '../contents/dashboard'
import Goals from '../contents/goals'
import Lists from '../contents/lists'
import Transactions from '../contents/transactions'


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