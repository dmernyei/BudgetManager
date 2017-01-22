import { observable, computed, action, reaction } from 'mobx'
import UserState from './user-state'


export default class AppState {
  
  _userState = new UserState(this)
  @observable _menuId = 0

  get userState() {
    return this._userState
  }

  @computed get menuId() {
    return this._menuId
  }

  @action setMenuId(menuId) {
    this._menuId = menuId;
  }
}