import "./Content.scss"
import React, {Component} from 'react'
import List from './List'
import Dropzone from './Dropzone'
import EmptyList from './EmptyList'

export default class Content extends Component {
    render() {
        const {results} = this.props

        return (
            <section className={`content-wrapper`}>
                {
                    results.length > 0 ?
                    <List /> :
                    this.props.visibleDropArea ?
                    <Dropzone onDrop={this.props.onDrop} /> :
                    <EmptyList />
                }
            </section>
        )
    }
}
