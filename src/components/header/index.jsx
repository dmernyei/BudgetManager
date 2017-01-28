import React, { Component } from 'react'


export default class Header extends Component {
    
    createSideElement(sideActionData, creatingLeft) {
        const sideElementClassName = creatingLeft ? "headerLeft" : "headerRight"
        
        if (undefined === sideActionData) {
            return(<div className={sideElementClassName}>&nbsp;</div>)
        }
        else {
            if (sideActionData.wrap) {
                return (
                    <div className={sideElementClassName}>
                        <a
                            href=""
                            onClick={e => {
                                e.preventDefault()
                                sideActionData.action()
                            }}
                        >
                            <h5>{sideActionData.GUI}</h5>
                        </a>
                    </div>
                )
            }
            else {
                return(<div className={sideElementClassName}>{sideActionData.GUI}</div>)
            }
        }
    }
    

    createCenterElement(centerActionData) {
        if (undefined === centerActionData) {
            return(<div className="headerCenter">&nbsp;</div>)
        }
        else {
            if (centerActionData.wrap) 
                return(<div className="headerCenter"><h2>{centerActionData.GUI}</h2></div>)
            else 
                return(<div className="headerCenter">{centerActionData.GUI}</div>)
        }
    }


    render() {
        const left = this.createSideElement(this.props.leftActionData, true)
        const center = this.createCenterElement(this.props.centerActionData)
        const right = this.createSideElement(this.props.rightActionData, false)

        return(
            <div>
                <div className="header">
                    {right}
                    {center}
                    {left}
                </div>
                <div>
                    <hr />
                </div>
            </div>
        )
    }
}