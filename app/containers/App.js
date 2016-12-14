// @flow
import './App.scss';
import React, { Component, PropTypes } from 'react'
import Header from '../components/Header'

// App:
export default class App extends Component {
    render() {
        return (
            <div>
                <Header location={this.props.location} />
                {this.props.children}
            </div>
        )
    }
}
