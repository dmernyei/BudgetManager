import { observable, computed, action, reaction } from 'mobx'
import uuid from 'uuid'
import sjcl from 'sjcl'


export default class AppState {

  @observable _user = null
  @observable _menuId = 0

  constructor() {
    this.testAction()
  }

  @action testAction() {
    this._user = {}
    this._user.name = "Daniel Mernyei"
  }

  @computed get isUserLoggedIn() {
    return this._user !== null
  }

  @computed get userName() {
    return this.isUserLoggedIn ? this._user.name : null
  }

  @computed get menuId() {
    return this._menuId
  }

  @action register(userName, password) {
    //todo
    // check: isUserNameUsed
  }

  @action logIn(userName, password) {
    //todo
  }

  @action logOut() {
    this._user = null
  }

  @action setMenuId(menuId) {
    this._menuId = menuId;
  }

  isUserNameUsed(userName) {
    //todo
  }

  encryptPassword() {
    var str = "abcdef123";
    var encrypted = sjcl.encrypt("password", str);
    var decrypted = sjcl.decrypt("password", encrypted);
  }
}