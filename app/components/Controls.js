import './Controls.scss';
import React, { Component } from 'react';
import {remote} from 'electron'
const appWindow = remote.getCurrentWindow()

export default class Controls extends Component {

    handleClose() {
        appWindow.close()
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
