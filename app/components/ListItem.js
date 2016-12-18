import "./ListItem.scss"
import React, {Component} from 'react'

export default class ListItem extends Component {
    constructor(props) {
        super(props)
        this.handleDoubleClick = this.handleDoubleClick.bind(this)
    }

    handleDoubleClick() {
        const {item} = this.props
        window.location.assign(item.ZipDownloadLink)
    }

    render() {
        const {handleClick, item, selected, index} = this.props

        return (
            <li className={`list-item ${index == selected ? 'selected' : ''}`} onClick={handleClick} onDoubleClick={this.handleDoubleClick}>
                {item.MovieReleaseName}
            </li>
        )
    }

}
