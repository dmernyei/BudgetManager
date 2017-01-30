import { observable, computed, action, reaction } from 'mobx'
import uuid from 'uuid'
import ContextState from './context-state'


export default class TransactionState extends ContextState {
    
    @observable _transactions = []
    _selectedTransactionIndex


    constructor(userState) {
        super(userState)
        this._contexts = ["main-page", "new-transaction", "list-of-transactions", "transaction-view"]
    }


    @computed get transactions() {
        return this._transactions
    }


    get selectedTransaction() {
        return this._transactions[this._selectedTransactionIndex]
    }


    resetState() {
        this.setContextIndex(0)
    }


    queryTransactions() {
        if (this._isQueryBeingProcessed)
            return
        else
            this._isQueryBeingProcessed = true
        
        fetch(`http://localhost:4000/transaction?filter[user]=${this.encodeIdToURL(this._userState.userId)}&sort=-date`,
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
            this._transactions = []
            json.data.forEach(obj => {
                this._transactions.push(Object.assign(obj.attributes, {id: obj.id, date: new Date(obj.attributes.date)}))
            })
        }))
        .then(() => this._isQueryBeingProcessed = false)
        .catch(e => {
            console.log(e)
            this._isQueryBeingProcessed = false
        })
    }


    selectTransaction(transactionId) {
        this.findSelectedTransactionIndexById(transactionId)
        if (-1 === this._selectedTransactionIndex) {
            console.log("Could not find the transaction to select.")
            return
        }

        this.setContextIndex(3)
    }


    findSelectedTransactionIndexById(transactionId) {
        var i
        for (i = 0; i < this._transactions.length; ++i) {
            if (transactionId === this._transactions[i].id) {
                this._selectedTransactionIndex = i
                return
            }
        }
        
        this._selectedTransactionIndex = -1
    }


    addTransaction(newTransaction) {
        if (this._isQueryBeingProcessed)
            return
        
        this._isQueryBeingProcessed = true
        newTransaction.id = uuid.v1()
        newTransaction.user = this._userState.userId

        const jsonData = {
            data: {
                type: 'transaction',
                id: newTransaction.id,
                attributes: {
                    amount: newTransaction.amount,
                    date: newTransaction.date,
                    category: newTransaction.category,
                    description: newTransaction.description,
                    user: newTransaction.user
                }
            }
        }

        fetch(`http://localhost:4000/transaction`, {
            method: 'POST',
            headers: {
                'Accept': 'application/vnd.api+json',
                'Content-Type': 'application/vnd.api+json',
            },
            body: JSON.stringify(jsonData)
        })
        .then(action(() => {
            this._transactions.push(newTransaction)
            this._userState.updateUserLiquidBalance(this._userState.userLiquidBalance + newTransaction.amount)
            this.setContextIndex(0)
        }))
        .then(() => this._isQueryBeingProcessed = false)
        .catch(e => {
            console.log(e)
            this._isQueryBeingProcessed = false
        })
    }
}