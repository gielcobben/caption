import './Controls.scss';
import React, { Component } from 'react';
import {remote, ipcRenderer} from 'electron'
const appWindow = remote.getCurrentWindow()

export default class Controls extends Component {

    constructor(props) {
        super(props)
        this.handleClose = this.handleClose.bind(this)
        this.handleMinimize = this.handleMinimize.bind(this)
        this.handleFullscreen = this.handleFullscreen.bind(this)
    }

    handleClose() {
        const {type} = this.props

        if (type === 'Settings') {
            ipcRenderer.send('close-settings');
        }
        else {
            ipcRenderer.send('close-main');
        }
    }

    handleMinimize() {
        appWindow.minimize()
    }

    handleFullscreen() {
        if (!appWindow.isMaximized()) {
            appWindow.maximize()
        } else {
            appWindow.unmaximize()
        }
    }

    render() {
        return (
            <ul className='controls'>
                <li className='close' onClick={this.handleClose}></li>
                <li className='minimize' onClick={this.handleMinimize}></li>
                <li className='fullscreen' onClick={this.handleFullscreen}></li>
            </ul>
        )
    }
}
