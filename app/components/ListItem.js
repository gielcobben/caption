import "./ListItem.scss"
import React, {Component} from 'react'
import {ipcRenderer} from 'electron'

export default class ListItem extends Component {

    handleDoubleClick() {
        const {item} = this.props
        window.location.assign(item.ZipDownloadLink)
    }

    render() {
        const {handleClick, item, selected, index} = this.props

        return (
            <li className={`list-item ${index == selected ? 'selected' : ''}`} onClick={handleClick} onDoubleClick={this.handleDoubleClick.bind(this)}>
                {item.MovieReleaseName}
            </li>
        )
    }

}
