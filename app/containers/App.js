import './App.scss';
import React, { Component, PropTypes } from 'react'
import Header from '../components/Header'

export default class App extends Component {

    componentWillMount() {
        // Prevent window from loading the dropped file
        window.addEventListener("dragenter", (event) => {
            event.preventDefault()
        }, false)

        window.addEventListener("dragover", (event) => {
            event.preventDefault()
        }, false)

        window.addEventListener("drop", (event) => {
            event.preventDefault()
        }, false)
    }

    render() {
        return (
            <div>
                <Header location={this.props.location} />
                {this.props.children}
            </div>
        )
    }
}
