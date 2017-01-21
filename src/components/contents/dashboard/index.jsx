import React, { Component } from 'react'
import { observer } from 'mobx-react'

@observer(['state'])
export default class Dashboard extends Component {
    
    render() {
        return(
            <div>
                dashboard
            </div>
        )
    }
}