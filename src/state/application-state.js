import { observable, computed, action, reaction } from 'mobx'
import UserState from './user-state'
import DialogState from './dialog-state'


export default class AppState {
  
  _userState = new UserState(this)
  _dialogState = new DialogState()
  @observable _menuId = 0

  get userState() {
    return this._userState
  }

  get dialogState() {
    return this._dialogState
  }

  @computed get menuId() {
    return this._menuId
  }

  @action setMenuId(menuId) {
    this._menuId = menuId;
  }
}