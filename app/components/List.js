import "./List.scss"
import React, {Component} from 'react'
import ListItem from './ListItem'
import Dropzone from './Dropzone'

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

        return (
            <section className='list-wrapper'>
                {
                    results.length > 0 ?
                    <ul className='list'>
                        {results.map((result, index) => {
                            return <ListItem key={index} item={result} handleClick={this.handleClick.bind(this, index)} selected={this.state.selected} index={index} />
                        })}
                    </ul> :
                    <Dropzone />
                }
            </section>
        )
    }
}
