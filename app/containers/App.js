// @flow
import OpenSubtitles from 'subtitler'
import React, { Component, PropTypes } from 'react'
import { TitleBar, Toolbar, SearchField } from 'react-desktop/macOs';
import List from '../components/List'
import {ipcRenderer, remote} from 'electron'

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
        return (
            <div>
                <TitleBar controls inset>
                    <Toolbar height="43" horizontalAlignment="center">
                        <SearchField width="300" placeholder="Search" defaultValue="" onCancel={this.handleCancel.bind(this)} onEnter={this.handleEnter.bind(this)} />
                        <select onChange={this.handleLanguage.bind(this)}>
                            <option value="eng">English</option>
                            <option value="dut">Dutch</option>
                        </select>
                    </Toolbar>
                </TitleBar>
                <List loading={this.state.loading} results={this.state.results} width={this.state.windowWidth} height={this.state.windowHeight} />
            </div>
        )
    }
}
