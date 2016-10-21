import './Controls.scss';
import React, { Component } from 'react';

export default class Controls extends Component {
    render() {
        return (
            <ul className='controls'>
                <li className='close'></li>
                <li className='minimize'></li>
                <li className='fullscreen'></li>
            </ul>
        )
    }
}
