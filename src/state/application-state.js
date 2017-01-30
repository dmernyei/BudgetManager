import { observable, computed, action, reaction } from 'mobx'
import UserState from './user-state'
import ListState from './list-state'
import GoalState from './goal-state'
import TransactionState from './transaction-state'
import DialogState from './dialog-state'


export default class AppState {
  
  _userState
  _listState
  _goalState
  _transactionState
  _dialogState
  @observable _menuId = 0


  constructor() {
    this._userState = new UserState(this)
    this._listState = new ListState(this._userState)
    this._goalState = new GoalState(this._userState)
    this._transactionState = new TransactionState(this._userState)
    this._dialogState = new DialogState()
  }


  get userState() {
    return this._userState
  }


  get listState() {
    return this._listState
  }


  get goalState() {
    return this._goalState
  }


  get transactionState() {
    return this._transactionState
  }


  get dialogState() {
    return this._dialogState
  }


  @computed get menuId() {
    return this._menuId
  }


  @action setMenuId(menuId) {
    this._menuId = menuId
  }


  resetAllStates() {
    this.setMenuId(0)
    this._listState.resetState()
    this._goalState.resetState()
    this.transactionState.resetState()
    this._dialogState.hide()
  }
}