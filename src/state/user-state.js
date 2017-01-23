import { observable, computed, action, reaction } from 'mobx'
import uuid from 'uuid'
import sjcl from 'sjcl'


export default class UserState {

    @observable _user = null
    @observable _isUserRejected = false
    @observable _userAction = -1            // -1: nothing, 0: registration, 1: login

    _appState
    _isQueryBeingProcessed = false
    

    constructor(appState) {
        this._appState = appState
    }


    @computed get isUserLoggedIn() {
        return this._user !== null
    }


    @computed get userName() {
        return this.isUserLoggedIn ? this._user.name : null
    }


    @computed get isUserRejected() {
        return this._isUserRejected
    }


    @computed get userAction() {
        return this._userAction
    }


    get isQueryBeingProcessed() {
        return this._isQueryBeingProcessed
    }


    @action checkUserToRegister(newUser, userNames) {
        this._isUserRejected = this.isUserNameAlreadyRegistered(newUser.name, userNames)
        this._userAction = 0
        
        if (!this._isUserRejected)
            this.registerUser(newUser)
        else
            this._isQueryBeingProcessed = false
    }


    @action checkUserToLogin(userToLogin, userNamesAndPasswords) {
        this._isUserRejected = !this.isUserNameAndPasswordCorrect(userToLogin, userNamesAndPasswords)
        this._userAction = 1
        
        if (!this._isUserRejected)
            this.logUserIn(userToLogin.id)
        else
            this._isQueryBeingProcessed = false
    }


    @action logOut() {
        this._user = null
    }


    processRegistration(userName, password) {
        this._isQueryBeingProcessed = true
        var newUser = {}
        newUser.name = userName
        newUser.password = this.encryptPassword(password)
        var userNames = []

        fetch(
        `http://localhost:4000/user?fields[user]=name`,
        {
            method: 'GET',
            headers:
            {
                'Accept': 'application/vnd.api+json',
                'Content-Type': 'application/vnd.api+json',
            }
        }
        )
        .then(response => response.json())
        .then(json => json.data.map(obj => userNames.push(obj.attributes.name)))
        .then(() => this.checkUserToRegister(newUser, userNames))
        .catch(e => {
            console.log(e)
            this._isQueryBeingProcessed = false
        })
    }


    isUserNameAlreadyRegistered(newUserName, userNames) {
        var i
        const length = userNames.length
        
        for (i = 0; i < length; ++i) {
            if (userNames[i] === newUserName)
                return true
        }
        return false
    }


    registerUser(newUser) {
        newUser.id = uuid.v1()
        newUser.liquidBalance = 0

        const jsonData = {
            data: {
                type: 'user',
                id: newUser.id,
                attributes: {
                    name: newUser.name,
                    password: newUser.password,
                    liquidBalance: newUser.liquidBalance,
                }
            }
        }

        fetch(`http://localhost:4000/user`, {
            method: 'POST',
            headers: {
                'Accept': 'application/vnd.api+json',
                'Content-Type': 'application/vnd.api+json',
            },
            body: JSON.stringify(jsonData)
        })
        .then(action(() => {
                this._appState.setMenuId(0)
                this._user = newUser
            }))
        .then(() => this._isQueryBeingProcessed = false)
        .catch(e => {
            console.log(e)
            this._isQueryBeingProcessed = false
        })
    }


    processLogin(userName, password) {
        this._isQueryBeingProcessed = true
        var userToLogin = {}
        userToLogin.name = userName
        userToLogin.password = this.encryptPassword(password)
        var userNamesAndPasswords = []

        fetch(
        `http://localhost:4000/user?fields[user]=name,password`,
        {
            method: 'GET',
            headers:
            {
                'Accept': 'application/vnd.api+json',
                'Content-Type': 'application/vnd.api+json',
            }
        }
        )
        .then(response => response.json())
        .then(json => {
            json.data.map(obj => {
                Object.assign(obj.attributes, {id: obj.id})
                userNamesAndPasswords.push(obj.attributes)
            })
        })
        .then(() => this.checkUserToLogin(userToLogin, userNamesAndPasswords))
        .catch(e => {
            console.log(e)
            this._isQueryBeingProcessed = false
        })
    }


    isUserNameAndPasswordCorrect(userToLogin, userNamesAndPasswords) {
        var i
        const length = userNamesAndPasswords.length

        for (i = 0; i < length; ++i) {
            if (userNamesAndPasswords[i].name === userToLogin.name
            && this.decryptPassword(userNamesAndPasswords[i].password) === this.decryptPassword(userToLogin.password)) {
                Object.assign(userToLogin, {id: userNamesAndPasswords[i].id})
                return true
            }
        }
        return false
    }


    logUserIn(userToLoginId) {
        fetch(`http://localhost:4000/user/${userToLoginId}`,
        {
            method: 'GET',
            headers:
            {
                'Accept': 'application/vnd.api+json',
                'Content-Type': 'application/vnd.api+json',
            }
        }
        )
        .then(response => response.json())
        .then(action(json => {
            this._appState.setMenuId(0)
            this._user = Object.assign(json.data.attributes, {id: json.data.id})
            this._isQueryBeingProcessed = false
        }))
        .catch(e => {
            console.log(e)
            this._isQueryBeingProcessed = false
        })
    }


    encryptPassword(password) {
        return sjcl.encrypt("password", password)
    }


    decryptPassword(encryptedPassword) {
        return sjcl.decrypt("password", encryptedPassword)
    }
}