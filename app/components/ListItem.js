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
        let title
        const {handleClick, item, selected, index} = this.props

        if (item.MovieReleaseName) {
            title = item.MovieReleaseName
        }
        else {
            title = item.name
        }

        console.log(title);

        return (
            <li className={`list-item ${index == selected ? 'selected' : ''}`} onClick={handleClick} onDoubleClick={this.handleDoubleClick}>
                {title}
            </li>
        )
    }

}
