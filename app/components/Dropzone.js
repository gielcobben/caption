import './Dropzone.scss'
import React, {Component} from 'react'

export default class Dropzone extends Component {

    constructor(props) {
        super(props)
        this.state = {
            dragging: false
        }
        this.onDragStart = this.onDragStart.bind(this)
    }

    onDragStart() {
        if (!this.state.dragging) {
            this.setState({
                dragging: true
            })
        }
        else {
            this.setState({
                dragging: false
            })
        }
    }

    render() {
        const {onDrop} = this.props

        return (
            <section className='dropzone' className={`dropzone ${this.state.dragging ? 'dragging' : ''}`} onDrop={onDrop} onDragStart={this.onDragStart}>
                <div className='zone'>
                    <h2>Drop an episode or season…</h2>
                </div>
            </section>
        )
    }
}
