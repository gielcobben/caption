// @flow
import './App.scss';
import React, { Component, PropTypes } from 'react'
import {ipcRenderer, remote} from 'electron'
import Header from '../components/Header'

const getLanguage = (cb) => {
    Storage.get('language', (error, data) => {
        if (error) console.log(error)
        cb(data.lang)
        // return data.lang
    })
}

// App:
export default class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            language: ''
        }
    }

    render() {

        ipcRenderer.on('change-language', () => {
            getLanguage((lang) => {
                this.setState({
                    language: lang
                })
            })
        })

        return (
            <div>
                <Header language={this.state.language} location={this.props.location} />
                {this.props.children}
            </div>
        )
    }
}
