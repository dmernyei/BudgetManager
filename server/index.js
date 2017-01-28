const express = require('express')
const cors = require('cors')
const fortune = require('fortune')
const nedbAdapter = require('fortune-nedb')
const createListener = require('fortune-http')
const jsonApiSerializer = require('fortune-json-api')


// Defining database schema
const recordTypes = {
    user: {
        name: String,
        password: String,
        liquidbalance: Number,
        lists: [ Array('list'), 'user' ],
        goals: [ Array('goal'), 'user' ],
        transactions: [ Array('transaction'), 'user' ],
    },
    list: {
        name: String,
        items: [ Array('listItem'), 'list' ],
        user: [ 'user', 'lists' ],
    },
    listItem: {
        isdone: Boolean,
        name: String,
        priority: Number,
        description: String,
        list: [ 'list', 'items' ],
    },
    goal: {
        name: String,
        goalamount: Number,
        allocatedamount: Number,
        deadline: Date,
        priority: Number,
        description: String,
        user: [ 'user', 'goals' ],
    },
    transaction: {
        amount: Number,
        date: Date,
        category: String,
        description: String,
        user: [ 'user', 'transactions' ],
    }
}

const adapter = [ nedbAdapter, { dbPath: __dirname + '/.db' }]

const store = fortune(recordTypes, { adapter })

// Initializing server
const server = express()
server.use(cors())
server.use(createListener(store, {
    serializers: [
        [ createListener.HtmlSerializer ],
        [ createListener.FormDataSerializer ],
        [ createListener.FormUrlEncodedSerializer ],
        [ jsonApiSerializer ],
    ]
}))

store.connect().then(() => {
    server.listen(4000)
    console.log('Server started on port 4000')
})