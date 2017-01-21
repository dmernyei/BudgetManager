import React, { Component } from 'react'
import { observer } from 'mobx-react'

@observer(['state'])
export default class Lists extends Component {
    
    render() {
        return(
            <div>
                lists
            </div>
        )
    }
}