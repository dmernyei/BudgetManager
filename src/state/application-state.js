import { observable, computed, action, reaction } from 'mobx'
import UserState from './user-state'
import ListState from './list-state'
import DialogState from './dialog-state'


export default class AppState {
  
  _userState
  _listState
  _dialogState
  @observable _menuId = 0

  constructor() {
    this._userState = new UserState(this)
    this._listState = new ListState(this._userState)
    this._dialogState = new DialogState()
  }

  get userState() {
    return this._userState
  }

  get listState() {
    return this._listState
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
    this._dialogState.hide()
  }
}