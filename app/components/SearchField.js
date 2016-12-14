import './SearchField.scss'

import React, {Component} from 'react'

export default class SearchField extends Component {

    constructor(props) {
        super(props)
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleLanguageChange = this.handleLanguageChange.bind(this)
    }

    componentDidMount() {
        this.textInput.focus()
        // this.textInput.onblur = () => {
        //     setTimeout(() => {
        //         this.textInput.focus()
        //     })
        // }
    }

    handleInputChange(event) {
        if (event.target.value === '') {
            this.props.resetList()
        }
        else {
            this.props.changeQuery(event.target.value)
        }
    }

    handleLanguageChange(event) {
        this.props.changeLanguage(event.target.value)
    }

    render() {
        const searchIcon = (
            <svg x="0px" y="0px" width="12px" height="12px" viewBox="0 0 25 24" data-radium="true">
                <path fill="none" stroke="#686868" stroke-width="1.8" stroke-miterlimit="10" d="M1.7,10.1c0-4.6,3.7-8.4,8.3-8.4s8.4,3.7,8.4,8.3 s-3.8,8.5-8.4,8.5S1.7,14.7,1.7,10.1z"></path>
                <line fill="none" stroke="#686868" stroke-width="1.8" stroke-miterlimit="10" x1="17" y1="16" x2="24.3" y2="23.3"></line>
            </svg>
        )

        return (
            <div className='search-field'>
                <form onSubmit={this.props.submitForm}>
                    <input ref={(input) => { this.textInput = input }} type="text" onChange={this.handleInputChange} placeholder="Search..." />
                    <label>Language:</label>
                    <select onChange={this.handleLanguageChange}>
                        <option value='eng'>English</option>
                        <option value='dut'>Netherlands</option>
                    </select>
                </form>
            </div>
        )
    }

}
