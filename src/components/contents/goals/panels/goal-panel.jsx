import React, { Component } from 'react'
import { observer } from 'mobx-react'


@observer(['state'])
export default class GoalPanel extends Component {
    
    computeGoalProgressPercentage() {
        return Math.round((this.props.goal.allocatedamount / this.props.goal.goalamount) * 100) + '%'
    }


    getProgressBarClassName() {
        return "progress-bar " + (this.props.goal.allocatedamount >= this.props.goal.goalamount ? "progress-bar-success" : "progress-bar-info")
    }


    onClick() {
        this.props.state.goalState.setChangingAmount(false)
        this.props.state.goalState.setGoalFormDataSet(false)
        this.props.state.goalState.selectGoal(this.props.goal.id)
    }


    render() {
        var priority
        switch (this.props.goal.priority) {
            case 1:
                priority = <p className="text-danger p-listItemPriority">!</p>
                break;
            case 2:
                priority = <p className="text-danger p-listItemPriority">!!</p>
                break;
            case 3:
                priority = <p className="text-danger p-listItemPriority">!!!</p>
                break;
            default:   // 0
                priority = <p className="text-danger p-listItemPriority">&nbsp;</p>
                break;
        }

        return (
            <div className="rootPanel" onClick={e => this.onClick()}>
                <div className="panelDetailsHolder">
                    <div className="goalPanelName">
                        <h4>{this.props.goal.name}</h4>
                    </div>
                    <div className="goalPanelPriority">
                        {priority}
                    </div>
                    <div className="goalPanelAmounts">
                        {this.props.goal.allocatedamount}/{this.props.goal.goalamount} Ft
                    </div>
                    <div className="goalPanelProgress">
                        <div className="progress">
                            <div className={this.getProgressBarClassName()} style={{width: this.computeGoalProgressPercentage()}}></div>
                        </div>
                    </div>
                </div>
                <hr />
            </div>
        )
    }
}