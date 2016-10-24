import "./ListItem.scss"
import React, {Component} from 'react'

export default class ListItem extends Component {
    render() {
        return (
            <li className="list-item">
                <span>{this.props.item.MovieReleaseName}</span>
            </li>
        )
    }
}
