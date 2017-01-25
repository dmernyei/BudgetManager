import { observable, computed, action, reaction } from 'mobx'


export default class DialogState {
    
    @observable _isVisible = false
    _title = "Are you sure?"
    _text = ""
    _okLabel = ""
    _cancelLabel = ""
    _okFunction = () => {}

    @computed get isVisible() {
        return this._isVisible
    }

    get title() {
        return this._title
    }

    get text() {
        return this._text
    }

    get okLabel() {
        return this._okLabel
    }

    get cancelLabel() {
        return this._cancelLabel
    }

    @action show(okFunction, text, okLabel, cancelLabel) {
        this._okFunction = okFunction
        this._text = text
        this._okLabel = okLabel
        this._cancelLabel = cancelLabel
        this._isVisible = true
    }

    @action hide() {
        this._isVisible = false
    }

    okFunction() {
        this._okFunction()
        this.hide()
    }
}