import React, { Component } from 'react'
import LoginForm from '../login-form'
import LoggedInUI from '../logged-in-ui'
import { observer } from 'mobx-react'
import Dialog from '../dialog'

@observer(['state'])
export default class Application extends Component {

  render() {
    const mainUI = this.props.state.userState.isUserLoggedIn ? <LoggedInUI /> : <LoginForm />

    return (
      <div className="application">
        {mainUI}
        <Dialog />
      </div>
    )
  }
}
