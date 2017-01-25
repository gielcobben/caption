import './Dropzone.scss'
import React, {Component} from 'react'

const Dropzone = ({onDrop, onDragEnter, onDragLeave, onDragOver, dragging}) => {
    return (
        <section className='dropzone' className={`dropzone ${dragging ? 'dragging' : ''}`} onDrop={onDrop} onDragEnter={onDragEnter} onDragLeave={onDragLeave} onDragOver={onDragOver}>
            <div className='zone'>
                <h2>Drop an episode or season…</h2>
            </div>
        </section>
    )
}

export default Dropzone