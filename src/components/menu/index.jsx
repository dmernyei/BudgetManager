import React, { Component } from 'react'
import { observer } from 'mobx-react'

@observer(['state'])
export default class Menu extends Component {
    
    handleClick(e, menuId) {
        e.preventDefault()
        if (5 === menuId)
            this.props.state.userState.logOut()
        else
            this.props.state.setMenuId(menuId)
    }

    render() {
        const userName = this.props.state.userState.userName
        const menuId = this.props.state.menuId
        return(
            <div className="menuHolder">
                <h3>{userName}</h3>
                <ul className="nav nav-pills nav-stacked">
                    <li className={menuId === 0 ? "active" : "notActive"}><a href="" onClick={e => this.handleClick(e, 0)}>Dashboard</a></li>
                    <li className={menuId === 1 ? "active" : "notActive"}><a href="" onClick={e => this.handleClick(e, 1)}>Lists</a></li>
                    <li className={menuId === 2 ? "active" : "notActive"}><a href="" onClick={e => this.handleClick(e, 2)}>Goals</a></li>
                    <li className={menuId === 3 ? "active" : "notActive"}><a href="" onClick={e => this.handleClick(e, 3)}>Transactions</a></li>
                    <li className={menuId === 4 ? "active" : "notActive"}><a href="" onClick={e => this.handleClick(e, 4)}>Account</a></li>
                    <li className="notActive"><a href="" onClick={e => this.handleClick(e, 5)}>Log out</a></li>
                </ul>
            </div>
        )
    }
}