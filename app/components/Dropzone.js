import './Dropzone.scss'
import React, {Component} from 'react'

export default class Dropzone extends Component {

    constructor(props) {
        super(props)
        this.state = {
            dragging: false
        }
        this.onDragEnter = this.onDragEnter.bind(this)
        this.onDragLeave = this.onDragLeave.bind(this)
        this.onDragOver = this.onDragOver.bind(this)
    }

    onDragEnter() {
        this.setState({
            dragging: true
        })
    }

    onDragLeave() {
        if (this.state.dragging) {
            this.setState({
                dragging: false
            })
        }
    }

    onDragOver() {
        if (!this.state.dragging) {
            this.setState({
                dragging: true
            })
        }
    }

    render() {
        const {onDrop} = this.props

        return (
            <section className='dropzone' className={`dropzone ${this.state.dragging ? 'dragging' : ''}`} onDrop={onDrop} onDragEnter={this.onDragEnter} onDragLeave={this.onDragLeave} onDragOver={this.onDragOver}>
                <div className='zone'>
                    <h2>Drop an episode or season…</h2>
                </div>
            </section>
        )
    }
}
