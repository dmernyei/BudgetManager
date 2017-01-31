import React, { Component } from 'react'
import { observer } from 'mobx-react'
import Header from '../../header'


@observer(['state'])
export default class Dashboard extends Component {
    
    computeAllocatedAmountSum() {
        var allocatedAmountSum = 0
        const goals = this.props.state.goalState.goals
        goals.forEach(goal => allocatedAmountSum += goal.allocatedamount)
        return allocatedAmountSum
    }


    getGoalInfo() {
        var goalInfo = []
        const goals = this.props.state.goalState.goals
        goals.forEach(goal => goalInfo.push(
            <div key={goal.id} className="goalInfoHolder">
                <p className="p-goalInfo">{goal.name}: {goal.allocatedamount} Ft</p>
            </div>
        ))
        return goalInfo
    }


    render() {
        const allocatedAmountSum = this.computeAllocatedAmountSum()
        const liquidBalance = this.props.state.userState.userLiquidBalance
        const balance = allocatedAmountSum + liquidBalance

        const centerActionData = {
            wrap: true,
            GUI: "Dashboard"
        }

        return(
            <div>
                <Header centerActionData={centerActionData} />
                <div className="dashboardInfoHolder">
                    <h4>Balance: {balance} Ft</h4>
                </div>
                <div className="dashboardInfoHolder">
                    <h4>Liquid balance: {liquidBalance} Ft</h4>
                </div>
                <div className="dashboardInfoHolder">
                    <h4>Allocated balance: {allocatedAmountSum} Ft</h4>
                    {this.getGoalInfo()}
                </div>
            </div>
        )
    }
}