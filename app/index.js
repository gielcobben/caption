// @flow
import React from "react"
import {render} from "react-dom"
import { Router, Route, hashHistory } from 'react-router'
import './app.global.css';

import App from './containers/App'

render((
    <Router history={hashHistory}>
        <Route path="/" component={App}/>
    </Router>
), document.getElementById('app'))
