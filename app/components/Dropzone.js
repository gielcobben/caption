import './Dropzone.scss'
import React, {Component} from 'react'

export default class Dropzone extends Component {
    render() {
        return (
            <section className='dropzone' onDrop={this.props.onDrop}>
                <div className='zone'>
                    <h2>Or drop your video file(s)…</h2>
                </div>
            </section>
        )
    }
}
