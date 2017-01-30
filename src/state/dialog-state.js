import { observable, computed, action, reaction } from 'mobx'


export default class DialogState {
    
    @observable _isVisible = false
    
    _isQuestion
    _title
    _text
    _okLabel
    _cancelLabel
    _okFunction = () => {}
    

    @computed get isVisible() {
        return this._isVisible
    }


    get isQuestion() {
        return this._isQuestion
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


    @action showQuestion(okFunction, title, text, okLabel, cancelLabel) {
        this._okFunction = okFunction
        this._title = title
        this._text = text
        this._okLabel = okLabel
        this._cancelLabel = cancelLabel    
        
        this._isQuestion = true
        this._isVisible = true
    }


    @action showInfo(title, text, okLabel) {
        this._title = title
        this._text = text
        this._okLabel = okLabel
        
        this._isQuestion = false
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