import "./List.scss"
import React, {Component} from 'react'
import ListItem from './ListItem'

export default class List extends Component {

    handleClick(e) {
        console.log(e)
    }

    render() {
        return (
            <ul className='list'>
                {this.props.results.map((result, index) => {
                    return <ListItem key={index} onClick={() => {
                        console.log(index)
                    }} item={result} />
                })}
            </ul>
        )
    }
}
