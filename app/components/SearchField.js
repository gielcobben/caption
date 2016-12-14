import './SearchField.scss'

import React, {Component} from 'react'

export default class SearchField extends Component {

    render() {

        const searchIcon = (
            <svg x="0px" y="0px" width="12px" height="12px" viewBox="0 0 25 24" data-radium="true">
                <path fill="none" stroke="#686868" stroke-width="1.8" stroke-miterlimit="10" d="M1.7,10.1c0-4.6,3.7-8.4,8.3-8.4s8.4,3.7,8.4,8.3 s-3.8,8.5-8.4,8.5S1.7,14.7,1.7,10.1z"></path>
                <line fill="none" stroke="#686868" stroke-width="1.8" stroke-miterlimit="10" x1="17" y1="16" x2="24.3" y2="23.3"></line>
            </svg>
        )

        return (
            <div className='search-field'>
                {/* <div>{searchIcon}</div> */}
                <form onSubmit={this.props.onSearch}>
                    <input type="text" placeholder="Search subtitles..." />
                </form>
            </div>
        )
    }

}
