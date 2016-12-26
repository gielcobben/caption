import './Dropzone.scss'
import React from 'react'

const Dropzone = ({onDrop}) => {
    return (
        <section className='dropzone' onDrop={onDrop}>
            <div className='zone'>
                <h2>Or drop an episode or season…</h2>
            </div>
        </section>
    )
}

export default Dropzone
