import React, { Component } from 'react'
import LoginForm from '../login-form'
import LoggedInUI from '../logged-in-ui'
import { observer } from 'mobx-react'

@observer(['state'])
export default class Application extends Component {
  render() {
    if (this.props.state.userState.isUserLoggedIn)
      return(<LoggedInUI />)
    else
      return(<LoginForm />)
  }
}
