import React, { Component } from 'react'
import { observable, action } from 'mobx'
import { observer } from 'mobx-react'
import DataComponent from '../../data-component'
import Header from '../../header'


@observer(['state'])
export default class AccountView extends DataComponent {
    
    newUserName = ""
    currentPassword = ""
    newPassword = ""

/*
    constructor(props) {
        super(props)

    }
*/

    onSubmit(e) {
        e.preventDefault()
        if (!this.isDataValid())
            return
        
        this.props.state.userState.processUpdateUserCredentials(this.newUserName, this.currentPassword, this.newPassword)
    }


    isDataValid() {
        if ("" === this.newUserName && "" === this.newPassword) {
            this.props.state.dialogState.showInfo("Error", "Please fill in at least one of the following fields: new user name, new password.", "Ok")
            return false
        }
        
        if ("" === this.currentPassword) {
            this.props.state.dialogState.showInfo("Error", "Please fill in the current password field.", "Ok")
            return false
        }

        return true
    }
    

    onDeleteAccountClicked(e) {
        e.preventDefault()
        this.props.state.dialogState.showQuestion(
            () => this.props.state.userState.processDeleteUser(),
            "Are you sure?",
            "We are sad to see you leaving. If you proceed, you will not be able to restore your account.",
            "Delete",
            "Cancel"
        )
    }


    render() {
        const centerActionData = {
            wrap: true,
            GUI: "Account"
        }

        var errorMessage = ""
        if (this.props.state.userState.isUserRejected)
            errorMessage = this.props.state.userState.userRejectionMessage

        return(
            <div>
                <Header centerActionData={centerActionData} />
                <form onSubmit={e => this.onSubmit(e)} className="form-horizontal">
                    <fieldset>
                        <div className="col-lg-10">
                            <label htmlFor="inputNewUserName" className="control-label">New user name (optional)</label>
                            <input
                                type="text" className="form-control" id="inputNewUserName"
                                onChange={e => this.assignData("newUserName", e.target.value)}
                            />
                        </div>
                        <div className="col-lg-10">
                            <label htmlFor="inputCurrentPassword" className="control-label">Current password (required)</label>
                            <input
                                type="password" className="form-control" id="inputCurrentPassword"
                                onChange={e => this.assignData("currentPassword", e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-lg-10">
                        <label htmlFor="inputNewPassword" className="control-label">New password (optional)</label>
                            <input
                                type="password" className="form-control" id="inputNewPassword"
                                onChange={e => this.assignData("newPassword", e.target.value)}
                            />
                        </div>
                        <div className="col-lg-10 col-lg-offset-2 updateUserCredentialsButtonHolder">
                            <p className="text-danger">{errorMessage}</p>
                            <button type="submit" className="btn btn-primary">Update</button>
                        </div>
                        <div className="col-lg-10 operationLinkHolderFirst">
                            <a className="deleteLinkDetails" onClick={e => this.onDeleteAccountClicked(e)} href="">Delete account</a>
                        </div>
                    </fieldset>
                </form>
            </div>
        )
    }
}