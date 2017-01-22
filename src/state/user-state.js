import { observable, computed, action, reaction } from 'mobx'
import uuid from 'uuid'
import sjcl from 'sjcl'


export default class UserState {

    _appState
    
    @observable _user = null
    @observable _userNames = []
    @observable _userNamesAndPasswords = []
    @observable _isUserRejected = false
    @observable _userAction = -1

    _isQueryBeingProcessed = false
    _userToTest = {}
    

    constructor(appState) {
        this._appState = appState
        
        reaction(
            () => this._userNames,
            userNames => this.checkUserToRegister() 
        )

        reaction(
            () => this._userNamesAndPasswords,
            userNamesAndPasswords => this.checkUserToLogin() 
        )
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


    @action logUserIn() {
        fetch(`http://localhost:4000/user/${this._userToTest.id}`,
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
        }))
        .catch(e => console.log(e))
    }


    @action logOut() {
        this._user = null
    }


    @action checkUserToRegister() {
        this._isUserRejected = this.isUserNameUsed()
        this._userAction = 0
        
        if (!this._isUserRejected)
        this.registerUser()

        this._isQueryBeingProcessed = false
    }


    registerUser() {
        var newUser = {}
        Object.assign(newUser, this._userToTest)

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
        .then(action(() => this._user = newUser))
        .catch(e => console.log(e))
    }


    @action checkUserToLogin() {
        this._isUserRejected = !this.isUserNameAndPasswordCorrect()
        this._userAction = 1
        
        if (!this._isUserRejected)
            this.logUserIn()

        this._isQueryBeingProcessed = false
    }


    initializeLogin(userName, password) {
        this._isQueryBeingProcessed = true
        this._userToTest.name = userName
        this._userToTest.password = this.encryptPassword(password)
        this.queryUserNamesAndPasswords()
    }


    initializeRegistration(userName, password) {
        this._isQueryBeingProcessed = true
        this._userToTest.name = userName
        this._userToTest.password = this.encryptPassword(password)
        this.queryUserNames()
    }


    queryUserNames() {
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
        .then(action(json => {
            this._userNames = []
            json.data.map(obj => this._userNames.push(obj.attributes.name))
        }))
        .catch(e => console.log(e))
    }


    queryUserNamesAndPasswords() {
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
        .then(action(json => {
            this._userNamesAndPasswords = []
            json.data.map(obj => {
                Object.assign(obj.attributes, {id: obj.id})
                this._userNamesAndPasswords.push(obj.attributes)
            })
        }))
        .catch(e => console.log(e))
    }


    isUserNameUsed() {
        var i
        const length = this._userNames.length

        for (i = 0; i < length; ++i) {
            if (this._userNames[i] === this._userToTest.name)
                return true
        }
        return false
    }


    isUserNameAndPasswordCorrect() {
        var i
        const length = this._userNamesAndPasswords.length

        for (i = 0; i < length; ++i) {
            if (this._userNamesAndPasswords[i].name === this._userToTest.name
            && this.decryptPassword(this._userNamesAndPasswords[i].password) === this.decryptPassword(this._userToTest.password)) {
                Object.assign(this._userToTest, {id: this._userNamesAndPasswords[i].id})
                return true
            }
        }
        return false
    }


    encryptPassword(password) {
        return sjcl.encrypt("password", password)
    }


    decryptPassword(encryptedPassword) {
        return sjcl.decrypt("password", encryptedPassword)
    }
}