import { observable, computed, action, reaction } from 'mobx'
import uuid from 'uuid'
import ContextState from './context-state'


export default class GoalState extends ContextState {
        
    constructor(userState) {
        super(userState)
        this._contexts = ["list-of-goals", "viewing-goal", "new-goal", "changing-allocated-amount"]
    }


    resetState() {
        // todo
    }
}