import React, { Component } from 'react'
import { observer } from 'mobx-react'

@observer(['state'])
export default class Goals extends Component {
    
    render() {
        return(
            <div>
                goals
            </div>
        )
    }
}