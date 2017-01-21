import React, { Component } from 'react'
import DataComponent from '../data-component'
import { observer } from 'mobx-react'


export default class LoginForm extends DataComponent {
    
    userName = ""
    password = ""
    isLoginPressed = false

    handleSubmit(e) {
        e.preventDefault()
        if (!this.isDataValid())
            return
        
        if (this.isLoginPressed && !this.props.state.logIn(this.userName, this.password)) {
            // todo: incorrect username or password (másik ág elvileg nem kell, automatikusan befrissül)
        }
        else if (!this.isLoginPressed && !this.props.state.register(this.userName, this.password)) {
            // username taken
        }
    }


    isDataValid() {
        return this.userName !== "" && this.password !== ""
    }


    render() {
        return(
            <div className="loginFormHolder">
                <form onSubmit={e => this.handleSubmit(e)} className="form-horizontal">
                    <fieldset>
                        <legend>Please log in</legend>
                        <div className="form-group">
                            <label htmlFor="userName" className="col-lg-2 control-label">User name</label>
                            <div className="col-lg-10">
                                <input
                                    type="text" className="form-control" id="inputUserName" placeholder="User name"
                                    onChange={e => this.assignData("userName", e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="inputPassword" className="col-lg-2 control-label">Password</label>
                            <div className="col-lg-10">
                                <input
                                    type="password" className="form-control" id="inputPassword" placeholder="Password"
                                    onChange={e => this.assignData("password", e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="col-lg-10 col-lg-offset-2">
                                <div className="buttonHolder">
                                    <button type="submit" onClick={e => this.isLoginPressed = true} className="btn btn-primary">Log in</button>
                                    <button type="submit" onClick={e => this.isLoginPressed = false} className="btn btn-default">...or register</button>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                </form>
            </div>
        )
    }
}
