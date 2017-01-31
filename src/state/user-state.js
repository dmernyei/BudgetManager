import { observable, computed, action, reaction } from 'mobx'
import uuid from 'uuid'
import sjcl from 'sjcl'
import QueryProcessorState from './query-processor-state'


export default class UserState extends QueryProcessorState {

    @observable _user = null
    
    @observable _userRejectionIndex = -1
    _userRejectionMessages = ["The specified user name is already registered.", "Incorrect user name or password.", "The current password is incorrect."]
    
    _appState
    

    constructor(appState) {
        super()
        this._appState = appState
    }


    @computed get isUserLoggedIn() {
        return this._user !== null
    }


    get userId() {
        return this._user.id
    }


    get userName() {
        return this._user.name
    }


    get userLiquidBalance() {
        return this._user.liquidbalance
    }


    @computed get isUserRejected() {
        return -1 !== this._userRejectionIndex
    }


    @computed get userRejectionMessage() {
        return this._userRejectionMessages[this._userRejectionIndex]
    }


    @action setUserRejectionIndex(userRejectionIndex) {
        this._userRejectionIndex = userRejectionIndex
    }

    
    @action logOut() {
        this.setUserRejectionIndex(-1)
        this._user = null
    }


    checkUserToRegister(newUser, userNames) {
        if (this.isUserNameAlreadyRegistered(newUser.name, userNames)) {
            this.setUserRejectionIndex(0)
            this._isQueryBeingProcessed = false
        }
        else {
            this.setUserRejectionIndex(-1)
            this.registerUser(newUser)
        }
    }


    checkUserToLogin(userToLogin, userNamesAndPasswords) {
        if (!this.isUserNameAndPasswordCorrect(userToLogin, userNamesAndPasswords)) {
            this.setUserRejectionIndex(1)
            this._isQueryBeingProcessed = false
        }
        else {
            this.setUserRejectionIndex(-1)
            this.logUserIn(userToLogin.id)
        }
    }


    checkUserToUpdateUserName(newUserData, userNames) {
        if (this.isUserNameAlreadyRegistered(newUserData.name, userNames)) {
            this.setUserRejectionIndex(0)
            this._isQueryBeingProcessed = false
        }
        else {
            this.setUserRejectionIndex(-1)
            this.updateUserCredentials(newUserData)
        }
    }


    processRegistration(userName, password) {
        if (this._isQueryBeingProcessed)
            return
        
        this._isQueryBeingProcessed = true
        var newUser = {}
        newUser.name = userName
        newUser.password = this.encryptPassword(password)
        var userNames = []

        fetch(`http://localhost:4000/user?fields[user]=name`,
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
        newUser.liquidbalance = 0

        const jsonData = {
            data: {
                type: 'user',
                id: newUser.id,
                attributes: {
                    name: newUser.name,
                    password: newUser.password,
                    liquidbalance: newUser.liquidbalance,
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
                this._user = newUser
                this._appState.resetAllStates()
            }))
        .then(() => this._isQueryBeingProcessed = false)
        .catch(e => {
            console.log(e)
            this._isQueryBeingProcessed = false
        })
    }


    processLogin(userName, password) {
        if (this._isQueryBeingProcessed)
            return
        
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
        })
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
        fetch(`http://localhost:4000/user/${this.encodeIdToURL(userToLoginId)}`,
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
            this._user = Object.assign(json.data.attributes, {id: json.data.id})
            this._isQueryBeingProcessed = false
            this._appState.resetAllStates()
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


    updateUserLiquidBalance(newLiquidBalance) {
        if (this._isQueryBeingProcessed)
            return
        
        this._isQueryBeingProcessed = true

        const jsonData = {
            data: {
                type: 'user',
                id: this._user.id,
                attributes: {
                    name: this._user.name,
                    password: this._user.password,
                    liquidbalance: newLiquidBalance,
                    lists: this._user.lists,
                    goals: this._user.goals,
                    transactions: this._user.transactions
                }
            }
        }

        fetch(`http://localhost:4000/user/${this.encodeIdToURL(this._user.id)}`, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/vnd.api+json',
                'Content-Type': 'application/vnd.api+json',
            },
            body: JSON.stringify(jsonData)
        })
        .then(action(() => this._user.liquidbalance = newLiquidBalance))
        .then(() => this._isQueryBeingProcessed = false)
        .catch(e => {
            console.log(e)
            this._isQueryBeingProcessed = false
        })
    }


    processUpdateUserCredentials(newUserName, currentPassword, newPassword) {
        if (this._isQueryBeingProcessed)
            return
        
        this._isQueryBeingProcessed = true

        if (this.decryptPassword(this._user.password) !== currentPassword) {
            this.setUserRejectionIndex(2)
            this._isQueryBeingProcessed = false
            return
        }
        else {
            this.setUserRejectionIndex(-1)
        }

        var newUserData = {}
        Object.assign(newUserData, this._user)

        if ("" !== newPassword)
            newUserData.password = this.encryptPassword(newPassword)

        if ("" !== newUserName) {
            newUserData.name = newUserName
            var userNames = []

            fetch(`http://localhost:4000/user?fields[user]=name`,
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
            .then(() => this.checkUserToUpdateUserName(newUserData, userNames))
            .catch(e => {
                console.log(e)
                this._isQueryBeingProcessed = false
            })
        }
        else {
            this.updateUserCredentials(newUserData)
        }
    }


    updateUserCredentials(newUserData) {
        const jsonData = {
            data: {
                type: 'user',
                id: newUserData.id,
                attributes: {
                    name: newUserData.name,
                    password: newUserData.password,
                    liquidbalance: newUserData.liquidbalance,
                    lists: newUserData.lists,
                    goals: newUserData.goals,
                    transactions: newUserData.transactions
                }
            }
        }

        fetch(`http://localhost:4000/user/${this.encodeIdToURL(newUserData.id)}`, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/vnd.api+json',
                'Content-Type': 'application/vnd.api+json',
            },
            body: JSON.stringify(jsonData)
        })
        .then(action(() => {
            this._user = newUserData
            this._appState.setMenuId(0)
        }))
        .then(() => this._isQueryBeingProcessed = false)
        .catch(e => {
            console.log(e)
            this._isQueryBeingProcessed = false
        })
    }


    processDeleteUser() {
        if (this._isQueryBeingProcessed)
            return
        
        this._isQueryBeingProcessed = true

        this._appState.transactionState.deleteUserTransactions()
        this._appState.goalState.deleteUserGoals()
        this._appState.listState.deleteUserLists()
        this.deleteUser()
        this._isQueryBeingProcessed = false

        this.logOut()
    }


    deleteUser() {
        fetch(`http://localhost:4000/user/${this.encodeIdToURL(this._user.id)}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/vnd.api+json',
            }
        })
        .catch(e => console.log(e))
    }
}