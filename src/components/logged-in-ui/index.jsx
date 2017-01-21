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
        var component
        switch(menuId) {
            case 1:
                component = <Lists />
                break
            case 2:
                component = <Goals />
                break
            case 3:
                component = <Transactions />
                break
            default:
                component = <Dashboard />
                break
        }

        return(
            <div>
                <Menu />
                {component}
            </div>
        )
    }
}