import './SearchField.scss'
import React, {Component} from 'react'
import ResetButton from './ResetButton'

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

        // Check if the is an value, if so show reset button
        if (defaultValue !== '') {
            reset = <ResetButton resetList={resetList} />
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
