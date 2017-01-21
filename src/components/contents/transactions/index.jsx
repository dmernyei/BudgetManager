import React, { Component } from 'react'
import { observer } from 'mobx-react'

@observer(['state'])
export default class Transactions extends Component {
    
    render() {
        return(
            <div>
                transactions
            </div>
        )
    }
}