import "./List.scss"
import React, {Component} from 'react'
import ListItem from './ListItem'

export default class List extends Component {

    handleClick(e) {
        console.log(e)
        console.log(clicked);
    }

    render() {
        return (
            <ul className='list'>
                {this.props.results.map((result, index) => {
                    return <ListItem onClick={this.handleClick.bind(this)} key={index} item={result} />
                })}
            </ul>
        )
    }
}
