// @flow
import './reset.scss';
import './global.scss';

import React from "react"
import {render} from "react-dom"
import { Router, Route, hashHistory } from 'react-router'

import App from './containers/App'

render((
    <Router history={hashHistory}>
        <Route path="/" component={App}/>
    </Router>
), document.getElementById('app'))
