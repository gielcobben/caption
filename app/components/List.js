import "./List.scss"
import React, {Component} from 'react'
import ListItem from './ListItem'
// import {remote} from 'electron'

// const {Menu, MenuItem} = remote
// const menu = new Menu()

export default class List extends Component {

    constructor(props) {
        super(props)

        this.state = {
            selected: null
        }
    }

    // componentWillMount() {
    //     window.addEventListener('contextmenu', (event) => {
    //         event.preventDefault()
    //         menu.popup(remote.getCurrentWindow())
    //     })
    // }

    // componentDidMount() {
    //     const menuItem = new MenuItem({
    //         label: 'Download',
    //         click: () => {
    //             console.log(this.state.selected);
    //         }
    //     })
    //     menu.append(menuItem)
    // }

    handleClick(index) {
        this.setState({
            selected: index
        })
    }

    render() {
        const {textSearch, fileSearch, results, resetList} = this.props

        return (
            <div className='inner'>
                <ul className={`list ${textSearch ? 'text' : 'file'}`}>
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

                    {fileSearch &&
                        results.map((file, index) => {
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
