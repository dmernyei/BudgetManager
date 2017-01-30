import React, { Component } from 'react'
import { observer } from 'mobx-react'
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalClose,
  ModalBody,
  ModalFooter
} from 'react-modal-bootstrap';


@observer(['state'])
export default class Dialog extends Component {

    render() {
        var buttons = []
        
        if (this.props.state.dialogState.isQuestion) {
            buttons.push(
                <button
                    key="0"
                    className='btn btn-default'
                    onClick={e => this.props.state.dialogState.hide()}
                >
                    {this.props.state.dialogState.cancelLabel}
                </button>
            )
        }
            
        buttons.push(
            <button
                key="1"
                className='btn btn-primary'
                onClick={this.props.state.dialogState.isQuestion ? e => this.props.state.dialogState.okFunction() : e => this.props.state.dialogState.hide()}
            >
                {this.props.state.dialogState.okLabel}
            </button>
        )

        return (
            <Modal
                isOpen={this.props.state.dialogState.isVisible}
                onRequestHide={e => this.props.state.dialogState.hide()}
                backdrop={false}
                backdropStyles = {{
                    base: {
                        background: 'rgba(0, 0, 0, 0.05)',
                        opacity: 0,
                        visibility: 'hidden',
                        transition: 'all 0.2s',
                        overflowX: 'hidden',
                        overflowY: 'auto'
                    },
                    open: {
                        opacity: 1,
                        visibility: 'visible'
                    }
                }}
                dialogStyles = {{
                    base: {
                        top: 0,
                        transition: 'top 0.2s'
                    },
                    open: {
                        top: 100
                    }
                }}
            >
                <ModalHeader>
                    <ModalClose onClick={e => this.props.state.dialogState.hide()}/>
                    <ModalTitle>{this.props.state.dialogState.title}</ModalTitle>
                </ModalHeader>
                <ModalBody>
                    <p>{this.props.state.dialogState.text}</p>
                </ModalBody>
                <ModalFooter>
                    {buttons}
                </ModalFooter>
            </Modal>
        )
    }
}