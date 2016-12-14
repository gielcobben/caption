// @flow
import './Header.scss';
import React, { Component } from 'react'
import {ipcRenderer} from 'electron'
import Title from '../components/Title'
import Controls from '../components/Controls'
import SettingsIcon from '../components/SettingsIcon'

const getTitle = pathname => {
    switch (pathname) {
        case '/settings':
            return 'Settings'
        default:
            return 'Caption'
    }
}

export default class Header extends Component {

    constructor(props) {
        super(props)
        this.handleClick = this.handleClick.bind(this)
        this.state = {
            settingsWindow: false
        }
    }

    handleClick() {
        ipcRenderer.send('open-settings')

        if (!this.state.settingsWindow) {
            this.setState({
                settingsWindow: true
            })
        }

        ipcRenderer.on('close-settings', () => {
            console.log('close-settings');
            this.setState({
                settingsWindow: false
            })
        })
    }

    render() {
        const {pathname} = this.props.location
        const title = getTitle(pathname)

        return (
            <header>
                <Controls type={title} />
                <Title title={title} />
                {/* {
                    pathname !== '/settings' &&
                    <SettingsIcon onClick={this.handleClick} />
                } */}
            </header>
        );
    }
}
