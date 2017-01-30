import React, { Component } from 'react'
import { observer } from 'mobx-react'
import ListOfGoals from './list-of-goals'
import GoalView from './goal-view'
import AllocatedAmountEditor from './allocated-amount-editor'


@observer(['state'])
export default class Goals extends Component {
    
    render() {
        var content

        switch(this.props.state.goalState.context) {
            case "viewing-goal":
                content = <GoalView goal={this.props.state.goalState.selectedGoal} />
                break;
            case "new-goal":
                content = <GoalView />
                break;
            case "changing-allocated-amount":
                content = <AllocatedAmountEditor />
                break;
            default:   // list-of-goals
                content = <ListOfGoals />
                break;
        }

        return(
            <div>
                {content}
            </div>
        )
    }
}