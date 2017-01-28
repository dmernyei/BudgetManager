import { observable, computed, action, reaction } from 'mobx'
import uuid from 'uuid'
import QueryProcessorState from './query-processor-state'
import UserState from './user-state'


export default class ContextState extends QueryProcessorState {
    
    @observable _contextIndex = 0
    _contexts = []
    _userState
    

    constructor(userState) {
        super()
        this._userState = userState
    }


    @computed get context() {
        return this._contexts[this._contextIndex]
    }


    @action setContextIndex(contextIndex) {
        this._contextIndex = contextIndex
    }
}