// @flow
import './App.scss';

import OpenSubtitles from 'subtitler'
import React, { Component, PropTypes } from 'react'
// import { TitleBar, Toolbar, SearchField, Button } from 'react-desktop/macOs';
import List from '../components/List'
import {ipcRenderer, remote} from 'electron'

// Giel:
import Header from '../components/Header'
import SearchField from '../components/SearchField'

// App:
export default class App extends Component {

    constructor(props, context) {
        super(props, context)

        this.state = {
            loading: false,
            token: null,
            query: null,
            lang: 'eng',
            results: [],
            windowWidth: 550,
            windowHeight: 450 - 43
        }
    }

    componentWillMount() {

        OpenSubtitles.api.login().then((token) => {
            this.setState({
                token: token
            })
        })
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize.bind(this));
        this.handleResize()
    }

    handleResize() {
        const mainWindow = remote.getCurrentWindow()
        const size = mainWindow.getSize()

        this.setState({
            windowWidth: size[0],
            windowHeight: size[1] - 43
        })
    }

    handleEnter(e) {
        if (e.target.value) {
            this.setState({
                query: e.target.value,
                loading: true
            })

            OpenSubtitles.api.searchForTitle(this.state.token, this.state.lang, this.state.query).then((results) => {
                this.setState({
                    results: results,
                    loading: false
                })
            })
        }
    }

    handleCancel(e) {
        this.setState({
            results: []
        })
    }

    handleLanguage(e) {
        this.setState({
            lang: e.target.value
        })
    }

    render() {
        const circle = (
            <svg x="0px" y="0px" width="25px" height="25px" viewBox="0 0 25 25">
                <circle cx="12.5" cy="12.5" r="12.5"/>
            </svg>
        )

        return (
            <div className="wrapper">
                <Header />
                <SearchField />
                {/* <SearchField width="250" placeholder="Search" defaultValue="" onCancel={this.handleCancel.bind(this)} onEnter={this.handleEnter.bind(this)} /> */}
                {/* <TitleBar controls inset>
                    <Toolbar height={36}>
                        <SearchField width="250" placeholder="Search" defaultValue="" onCancel={this.handleCancel.bind(this)} onEnter={this.handleEnter.bind(this)} />
                        <select className="select" onChange={this.handleLanguage.bind(this)}>
                            <option value="eng">English</option>
                            <option value="dut">Dutch</option>
                        </select>
                        <Button padding={5} />
                    </Toolbar>
                </TitleBar>
                <List loading={this.state.loading} results={this.state.results} width={this.state.windowWidth} height={this.state.windowHeight} /> */}
            </div>
        )
    }
}
