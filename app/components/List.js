import "./List.scss"
import React, {Component} from 'react'
import ListItem from './ListItem'

export default class List extends Component {

    constructor(props) {
        super(props)
        this.state = {
            selected: null
        }
    }

    handleClick(index) {
        this.setState({
            selected: index
        })
    }

    render() {
        let content
        const {results} = this.props

        if (results.length > 0) {
            content = (
                results.map((result, index) => {
                    return <ListItem key={index} item={result} handleClick={this.handleClick.bind(this, index)} selected={this.state.selected} index={index} />
                })
            )
        }
        else {
            content = (
                <li>Giel</li>
            )
        }

        return (
            <section className='list-wrapper'>
                <ul className='list'>
                    {content}
                </ul>
            </section>
        )
    }
}
