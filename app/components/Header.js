import './Header.scss';
import React, { Component } from 'react'
import {ipcRenderer} from 'electron'
import Title from '../components/Title'
import Controls from '../components/Controls'

const getTitle = pathname => {
    switch (pathname) {
        case '/settings':
            return 'Settings'
        default:
            return 'Caption'
    }
}

export default class Header extends Component {

    render() {
        const {pathname} = this.props.location
        const title = getTitle(pathname)

        return (
            <header>
                {/* <Controls type={title} /> */}
                <Title title={title} />
            </header>
        );
    }
}
