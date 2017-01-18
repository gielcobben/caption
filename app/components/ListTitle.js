import './ListTitle.scss'
import React from 'react'

const ListTitle = ({length, success, resetList}) => {
    const resetIcon = (
        <svg x="0px" y="0px" width="14" height="14" viewBox="0 0 14 14" data-radium="true">
            <circle cx="7" cy="7" r="7" fill="black"/>
            <path fill="#FFF" d="M8 7l2-2-1-1-2 2-2-2-1 1 2 2-2 2 1 1 2-2 2 2 1-1-2-2z"/>
        </svg>
    )

    return (
        <section className='listtitle'>
            <span>Searching {length < 10 ? `0${length}` : length} files...</span>
            <span className="reset" onClick={resetList}>{resetIcon}</span>        
        </section>
    )
}

export default ListTitle