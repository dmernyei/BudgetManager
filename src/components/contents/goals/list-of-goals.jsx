import React, { Component } from 'react'
import { observer } from 'mobx-react'
import List from '../../list'
import GoalPanel from './panels/goal-panel'
import Header from '../../header'


@observer(['state'])
export default class ListOfGoals extends Component {
    
    onAddButtonClicked() {
        this.props.state.goalState.setChangingAmount(false)
        this.props.state.goalState.setGoalFormDataSet(false)
        this.props.state.goalState.setContextIndex(2)
    }
    

    render() {
        const goals = this.props.state.goalState.goals
        var panels = []
        goals.forEach(goal => panels.push(<GoalPanel key={goal.id} goal={goal} />))
        
        const centerActionData = {
            wrap: true,
            GUI: "Goals"
        }

        return (
            <div>
                <Header centerActionData={centerActionData} />
                <List panels={panels} />
                <div className="rootPanel">
                    <button className="btn btn-danger addButton" onClick={e => this.onAddButtonClicked()}><h2>+</h2></button>
                </div>
            </div>
        )
    }
}