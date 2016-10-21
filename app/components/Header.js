// @flow
import './Header.scss';
import React, { Component } from 'react'
import Title from '../components/Title'
import Controls from '../components/Controls'
import SettingsIcon from '../components/SettingsIcon'

export default class Header extends Component {
    render() {
        return (
            <header>
                <Controls />
                <Title />
                <SettingsIcon />
            </header>
        );
    }
}
