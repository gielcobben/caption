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
        const {textSearch, droppedFiles, results, files} = this.props

        return (
            <div className='inner'>
                <ul className='list'>
                    {textSearch &&
                        results.map((result, index) => {
                            return (
                                <ListItem
                                    key={index}
                                    item={result}
                                    handleClick={this.handleClick.bind(this, index)}
                                    selected={this.state.selected}
                                    index={index}
                                />
                            )
                        })
                    }
                    {droppedFiles &&
                        files.map((file, index) => {

                            console.log(file)

                            return (
                                <ListItem
                                    key={index}
                                    item={file}
                                    handleClick={this.handleClick.bind(this, index)}
                                    selected={this.state.selected}
                                    index={index}
                                />
                            )
                        })
                    }
                </ul>
            </div>
        )
    }
}
