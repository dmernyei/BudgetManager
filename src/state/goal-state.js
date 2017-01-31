import { observable, computed, action, reaction } from 'mobx'
import uuid from 'uuid'
import ContextState from './context-state'


export default class GoalState extends ContextState {
        
    @observable _goals = []
    _selectedGoalIndex

    _changingAmount
    _addingAmount
    _deltaAmount
    
    _isGoalFormDataSet
    _goalFormData

    constructor(userState) {
        super(userState)
        this._contexts = ["list-of-goals", "viewing-goal", "new-goal", "changing-allocated-amount"]
    }


    @computed get goals() {
        return this._goals
    }


    get selectedGoal() {
        return this._goals[this._selectedGoalIndex]
    }


    get changingAmount() {
        return this._changingAmount
    }


    get addingAmount() {
        return this._addingAmount
    }


    get deltaAmount() {
        return this._deltaAmount
    }


    get isGoalFormDataSet() {
        return this._isGoalFormDataSet
    }


    get goalFormData() {
        return this._goalFormData
    }


    setChangingAmount(changingAmount) {
        this._changingAmount = changingAmount
    }


    setAddingAmount(addingAmount) {
        this._addingAmount = addingAmount
    }


    setDeltaAmount(deltaAmount) {
        this._deltaAmount = deltaAmount
    }


    setGoalFormDataSet(isGoalFormDataSet) {
        this._isGoalFormDataSet = isGoalFormDataSet
    }


    setGoalFormData(goalFormData) {
        this._goalFormData = goalFormData
    }


    resetState() {
        this.setContextIndex(0)
        this.queryGoals()
    }


    queryGoals() {
        if (this._isQueryBeingProcessed)
            return
        else
            this._isQueryBeingProcessed = true
        
        fetch(
        `http://localhost:4000/goal?filter[user]=${this.encodeIdToURL(this._userState.userId)}`,
        {
            method: 'GET',
            headers:
            {
                'Accept': 'application/vnd.api+json',
                'Content-Type': 'application/vnd.api+json',
            }
        })
        .then(response => response.json())
        .then(action(json => {
            this._goals = []
            json.data.forEach(obj => {
                this._goals.push(Object.assign(obj.attributes, {id: obj.id, deadline: new Date(obj.attributes.deadline)}))
            })
        }))
        .then(() => this._isQueryBeingProcessed = false)
        .catch(e => {
            console.log(e)
            this._isQueryBeingProcessed = false
        })
    }


    selectGoal(goalId) {
        this.findGoalIndexById(goalId)
        if (-1 === this._selectedGoalIndex) {
            console.log("Could not find the goal to be selected.")
            return
        }

        this.setContextIndex(1)
    }


    findGoalIndexById(goalId) {
        var i
        for (i = 0; i < this._goals.length; ++i) {
            if (goalId === this._goals[i].id) {
                this._selectedGoalIndex = i
                return
            }
        }
        this._selectedGoalIndex = -1
    }
    
    
    addGoal(newGoal) {
        if (this._isQueryBeingProcessed)
            return
        
        this._isQueryBeingProcessed = true
        
        newGoal.id = uuid.v1()
        newGoal.user = this._userState.userId

        const jsonData = {
            data: {
                type: 'goal',
                id: newGoal.id,
                attributes: {
                    name: newGoal.name,
                    goalamount: newGoal.goalamount,
                    allocatedamount: newGoal.allocatedamount,
                    deadline: newGoal.deadline,
                    priority: newGoal.priority,
                    description: newGoal.description,
                    user: newGoal.user,
                }
            }
        }

        fetch(`http://localhost:4000/goal`, {
            method: 'POST',
            headers: {
                'Accept': 'application/vnd.api+json',
                'Content-Type': 'application/vnd.api+json',
            },
            body: JSON.stringify(jsonData)
        })
        .then(action(() => {
            this._goals.push(newGoal)
            this.setContextIndex(0)
        }))
        .then(() => this._isQueryBeingProcessed = false)
        .catch(e => {
            console.log(e)
            this._isQueryBeingProcessed = false
        })
    }


    updateGoal(goal) {
        if (this._isQueryBeingProcessed)
            return
        
        this._isQueryBeingProcessed = true

        if (this._changingAmount) {
            if (this._addingAmount)
                goal.allocatedamount += this._deltaAmount
            else
                goal.allocatedamount -= this._deltaAmount
        }

        const jsonData = {
            data: {
                type: 'goal',
                id: goal.id,
                attributes: {
                    name: goal.name,
                    goalamount: goal.goalamount,
                    allocatedamount: goal.allocatedamount,
                    deadline: goal.deadline,
                    priority: goal.priority,
                    description: goal.description,
                    user: goal.user,
                }
            }
        }

        fetch(`http://localhost:4000/goal/${this.encodeIdToURL(goal.id)}`, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/vnd.api+json',
                'Content-Type': 'application/vnd.api+json',
            },
            body: JSON.stringify(jsonData)
        })
        .then(action(() => {
            Object.assign(this._goals[this._selectedGoalIndex], goal)
            if (this._changingAmount) {
                if (this._addingAmount)
                    this._userState.updateUserLiquidBalance(this._userState.userLiquidBalance - this._deltaAmount)
                else
                    this._userState.updateUserLiquidBalance(this._userState.userLiquidBalance + this._deltaAmount)
            }
            this.setContextIndex(0)
        }))
        .then(() => this._isQueryBeingProcessed = false)
        .catch(e => {
            console.log(e)
            this._isQueryBeingProcessed = false
        })
    }


    deleteSelectedGoal() {
        if (this._isQueryBeingProcessed)
            return
        
        this._isQueryBeingProcessed = true
        var goalToDelete = this._goals[this._selectedGoalIndex]
        
        fetch(`http://localhost:4000/goal/${this.encodeIdToURL(goalToDelete.id)}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/vnd.api+json',
            }
        })
        .then(action(() => {
            this._goals.splice(this._selectedGoalIndex, 1)
            this._userState.updateUserLiquidBalance(this._userState.userLiquidBalance + goalToDelete.allocatedamount)
            this.setContextIndex(0)
        }))
        .then(() => this._isQueryBeingProcessed = false)
        .catch(e => {
            console.log(e)
            this._isQueryBeingProcessed = false
        })
    }


    deleteUserGoals() {
        if (this._isQueryBeingProcessed)
            return
        
        this._isQueryBeingProcessed = true
        this._goals.forEach(goal => this.deleteGoal(goal.id))
        this._isQueryBeingProcessed = false
    }


    deleteGoal(goalId) {
        fetch(`http://localhost:4000/goal/${this.encodeIdToURL(goalId)}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/vnd.api+json',
            }
        })
        .catch(e => console.log(e))
    }
}