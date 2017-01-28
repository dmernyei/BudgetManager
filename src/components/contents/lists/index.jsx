import React, { Component } from 'react'
import { observer } from 'mobx-react'
import ListOfLists from './list-of-lists'
import NewListForm from './new-list-form'
import ListContentView from './list-content-view'
import ListItemView from './list-item-view'


@observer(['state'])
export default class Lists extends Component {
    render() {
        var content

        switch(this.props.state.listState.context) {
            case "new-list":
                content = <NewListForm />
                break;
            case "content-of-list":
                content = <ListContentView isEditing={false} />
                break;
            case "editing-list":
                content = <ListContentView isEditing={true} />
                break;
            case "viewing-list-item":
                content = <ListItemView listItem={this.props.state.listState.selectedListItem} />
                break;
            case "new-list-item":
                content = <ListItemView />
                break;
            default:   // list-of-lists
                content = <ListOfLists />
                break;
        }

        return(
            <div>
                {content}
            </div>
        )
    }
}