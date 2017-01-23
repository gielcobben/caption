import './SearchField.scss'

import React, {Component} from 'react'

export default class SearchField extends Component {

    constructor(props) {
        super(props)
        this.handleInputChange = this.handleInputChange.bind(this)
    }

    componentDidMount() {
        // Focus on mount
        this.textInput.focus()
    }

    handleInputChange(event) {
        if (event.target.value === '') {
            // If input is empty, reset list
            this.props.resetList()
        }
        else {
            // Change query on every keypress
            this.props.changeQuery(event.target.value)
        }
    }

    render() {
        let reset
        const {submitForm, resetList, defaultValue, selectedLanguage} = this.props

        const resetIcon = (
            <svg x="0px" y="0px" width="14" height="14" viewBox="0 0 14 14" data-radium="true">
                <circle cx="7" cy="7" r="7" fill="gray"/>
                <path fill="#FFF" d="M8 7l2-2-1-1-2 2-2-2-1 1 2 2-2 2 1 1 2-2 2 2 1-1-2-2z"/>
            </svg>
        )

        // Check if the is an value, if so show reset button
        if (defaultValue !== '') {
            reset = <span className="reset" onClick={resetList}>{resetIcon}</span>
        }
        else {
            reset = ''
        }

        return (
            <section className='search-field'>
                <form onSubmit={submitForm}>
                    {reset}
                    <input
                        ref={(input) => { this.textInput = input }}
                        type="text"
                        onChange={this.handleInputChange}
                        value={defaultValue}
                        placeholder="Search..."
                    />
                </form>
            </section>
        )
    }

}
