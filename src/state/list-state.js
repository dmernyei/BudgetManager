import { observable, computed, action, reaction } from 'mobx'
import uuid from 'uuid'
import ContextState from './context-state'


export default class ListState extends ContextState {

    @observable _lists = []
    @observable _listItems = []

    _selectedListIndex
    _selectedListItemIndex


    constructor(userState) {
        super(userState)
        this._contexts = ["list-of-lists", "new-list", "content-of-list", "editing-list", "viewing-list-item", "new-list-item"]
    }
    

    @computed get lists() {
        return this._lists
    }


    @computed get listItems() {
        return this._listItems
    }


    get selectedList() {
        return 2 <= this._contextIndex ? this._lists[this._selectedListIndex] : null
    }


    get selectedListItem() {
        return 4 === this._contextIndex ? this._listItems[this._selectedListItemIndex] : null
    }


    resetState() {
        this.setContextIndex(0)
        this.queryLists()
    }


    queryLists() {
        if (this._isQueryBeingProcessed)
            return
        else
            this._isQueryBeingProcessed = true
        
        fetch(`http://localhost:4000/list?filter[user]=${this.encodeIdToURL(this._userState.userId)}`,
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
            this._lists = []
            json.data.forEach(obj => {
                this._lists.push(Object.assign(obj.attributes, {id: obj.id}))
            })
        }))
        .then(() => this._isQueryBeingProcessed = false)
        .catch(e => {
            console.log(e)
            this._isQueryBeingProcessed = false
        })
    }


    addList(name) {
        if (this._isQueryBeingProcessed)
            return
        
        this._isQueryBeingProcessed = true
        var newList = {}
        newList.id = uuid.v1()
        newList.name = name
        newList.user = this._userState.userId

        const jsonData = {
            data: {
                type: 'list',
                id: newList.id,
                attributes: {
                    name: newList.name,
                    user: newList.user,
                }
            }
        }

        fetch(`http://localhost:4000/list`, {
            method: 'POST',
            headers: {
                'Accept': 'application/vnd.api+json',
                'Content-Type': 'application/vnd.api+json',
            },
            body: JSON.stringify(jsonData)
        })
        .then(action(() => {
            this._lists.push(newList)
            this.setContextIndex(0)
        }))
        .then(() => this._isQueryBeingProcessed = false)
        .catch(e => {
            console.log(e)
            this._isQueryBeingProcessed = false
        })
    }


    selectList(listId) {
        if (this._isQueryBeingProcessed)
            return
        
        this._isQueryBeingProcessed = true
        this.setSelectedListIndex(listId)
        if (-1 === this._selectedListIndex) {
            console.log("Could not find list to select.")
            this._isQueryBeingProcessed = false
            return
        }
        
        fetch(`http://localhost:4000/listItem?filter[list]=${this.encodeIdToURL(listId)}`,
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
            this._listItems = []
            json.data.forEach(obj => {
                this._listItems.push(Object.assign(obj.attributes, {id: obj.id}))
            })
        }))
        .then(() => this.setContextIndex(2))
        .then(() => this._isQueryBeingProcessed = false)
        .catch(e => {
            console.log(e)
            this._isQueryBeingProcessed = false
        })
    }


    setSelectedListIndex(listId) {
        var i
        for (i = 0; i < this._lists.length; ++i) {
            if (listId === this._lists[i].id) {
                this._selectedListIndex = i
                return
            }
        }
        this._selectedListIndex = -1
    }


    selectListItem(listItemId) {
        this.setSelectedListItemIndex(listItemId)

        if (-1 === this._selectedListItemIndex)
            console.log("Could not find list item to select.")
        else
            this.setContextIndex(4)
    }


    setSelectedListItemIndex(listItemId) {
        var i
        for (i = 0; i < this._listItems.length; ++i) {
            if (listItemId === this._listItems[i].id) {
                this._selectedListItemIndex = i
                return
            }
        }
        this._selectedListItemIndex = -1
    }


    addListItem(listItem) {
        if (this._isQueryBeingProcessed)
            return
        
        this._isQueryBeingProcessed = true

        listItem.id = uuid.v1()
        listItem.list = this._lists[this._selectedListIndex].id

        const jsonData = {
            data: {
                type: 'listItem',
                id: listItem.id,
                attributes: {
                    isdone: listItem.isdone,
                    name: listItem.name,
                    priority: listItem.priority,
                    description: listItem.description,
                    list: listItem.list
                }
            }
        }

        fetch(`http://localhost:4000/listItem`, {
            method: 'POST',
            headers: {
                'Accept': 'application/vnd.api+json',
                'Content-Type': 'application/vnd.api+json',
            },
            body: JSON.stringify(jsonData)
        })
        .then(action(() => {
            this._listItems.push(listItem)
            this.setContextIndex(2)
        }))
        .then(() => this._isQueryBeingProcessed = false)
        .catch(e => {
            console.log(e)
            this._isQueryBeingProcessed = false
        })
    }


    updateListItem(listItem, isDoneOnly) {
        if (this._isQueryBeingProcessed)
            return
        
        this._isQueryBeingProcessed = true

        const jsonData = {
            data: {
                type: 'listItem',
                id: listItem.id,
                attributes: {
                    isdone: listItem.isdone,
                    name: listItem.name,
                    priority: listItem.priority,
                    description: listItem.description,
                    list: listItem.list
                }
            }
        }

        fetch(`http://localhost:4000/listItem/${this.encodeIdToURL(listItem.id)}`, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/vnd.api+json',
                'Content-Type': 'application/vnd.api+json',
            },
            body: JSON.stringify(jsonData)
        })
        .then(action(() => {
            if (!isDoneOnly) {
                Object.assign(this._listItems[this._selectedListItemIndex], listItem)
                this.setContextIndex(2)
            }
        }))
        .then(() => this._isQueryBeingProcessed = false)
        .catch(e => {
            console.log(e)
            this._isQueryBeingProcessed = false
        })
    }


    deleteListItem(listItemId, sendQueryOnly) {
        if(this._isQueryBeingProcessed && !sendQueryOnly)
            return
        
        if(!sendQueryOnly) {
            this._isQueryBeingProcessed = true

            var indexOfListItemToDelete = this.findIndexOfListItemToDelete(listItemId)
            if (-1 === indexOfListItemToDelete) {
                console.log("Could not find list item to delete.")
                this._isQueryBeingProcessed = false
                return
            }
        }

        fetch(`http://localhost:4000/listItem/${this.encodeIdToURL(listItemId)}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/vnd.api+json',
            }
        })
        .then(action(() => {
            if (!sendQueryOnly)
                this._listItems.splice(indexOfListItemToDelete, 1)
        }))
        .then(() => {
            if (!sendQueryOnly)
                this._isQueryBeingProcessed = false
        })
        .catch(e => {
            console.log(e)
            if (!sendQueryOnly)
                this._isQueryBeingProcessed = false
        })
    }


    findIndexOfListItemToDelete(listItemId) {
        var i
        for (i = 0; i < this._listItems.length; ++i) {
            if (listItemId === this._listItems[i].id)
                return i
        }
        return -1
    }


    updateSelectedListName(listName) {
        if (this._isQueryBeingProcessed)
            return
        
        this._isQueryBeingProcessed = true

        var selectedlist = {}
        Object.assign(selectedlist, this._lists[this._selectedListIndex])
        selectedlist.name = listName

        const jsonData = {
            data: {
                type: 'list',
                id: selectedlist.id,
                attributes: {
                    name: selectedlist.name,
                    items: selectedlist.items,
                    user: selectedlist.user
                }
            }
        }

        fetch(`http://localhost:4000/list/${this.encodeIdToURL(selectedlist.id)}`, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/vnd.api+json',
                'Content-Type': 'application/vnd.api+json',
            },
            body: JSON.stringify(jsonData)
        })
        .then(action(() => {
            this._lists[this._selectedListIndex].name = listName
            this.setContextIndex(2)
        }))
        .then(() => this._isQueryBeingProcessed = false)
        .catch(e => {
            console.log(e)
            this._isQueryBeingProcessed = false
        })
    }


    deleteSelectedList() {
        if (this._isQueryBeingProcessed)
            return
        
        this._isQueryBeingProcessed = true

        this._listItems.forEach(listItem => this.deleteListItem(listItem.id, true))

        fetch(`http://localhost:4000/list/${this.encodeIdToURL(this._lists[this._selectedListIndex].id)}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/vnd.api+json',
            }
        })
        .then(action(() => {
            this._lists.splice(this._selectedListIndex, 1)
            this.setContextIndex(0)
        }))
        .then(() => this._isQueryBeingProcessed = false)
        .catch(e => {
            console.log(e)
            this._isQueryBeingProcessed = false
        })
    }


    deleteUserLists() {
        if (this._isQueryBeingProcessed)
            return

        this._isQueryBeingProcessed = true
        
        this.processDeleteUserListItems()
        this._lists.forEach(list => this.deleteList(list.id))

        this._isQueryBeingProcessed = false        
    }


    deleteList(listId) {
        fetch(`http://localhost:4000/list/${this.encodeIdToURL(listId)}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/vnd.api+json',
            }
        })
        .catch(e => console.log(e))
    }


    processDeleteUserListItems() {
        const listIdListString = this.generateListIdListString()
        var listItemIds = []

        fetch(`http://localhost:4000/listItem?fields[listItem]=name&filter[list]=${listIdListString}`,
        {
            method: 'GET',
            headers:
            {
                'Accept': 'application/vnd.api+json',
                'Content-Type': 'application/vnd.api+json',
            }
        })
        .then(response => response.json())
        .then(json => json.data.forEach(obj => listItemIds.push(obj.id)))
        .then(() => listItemIds.forEach(listItemId => this.deleteListItem(listItemId, true)))
        .catch(e => console.log(e))
    }


    generateListIdListString() {
        var listIds = []
        this._lists.forEach(list => listIds.push(this.encodeIdToURL(list.id)))

        var listIdListString = ""
        var length = listIds.length
        var i
        for (i = 0; i < length; ++i) {
            listIdListString += String(listIds[i])
            if (i < length - 1)
                listIdListString += ','
        }

        return listIdListString
    }
}