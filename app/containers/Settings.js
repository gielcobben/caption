import './Settings.scss';
import React, {Component} from 'react'
import Storage from 'electron-json-storage'

export default class Settings extends Component {

    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(e) {
        const options = e.target.options
        const selected = options.selectedIndex
        const language = options[selected].value

        Storage.set('language', {lang: language}, (error) => {
            if (error) console.log(error)
        })
    }

    render() {
        return (
            <div className="settings">
                <form>
                    <label>Language:</label>
                    <select onChange={this.handleChange}>
                        <option value="dut">Dutch</option>
                        <option value="eng">English</option>
                    </select>
                </form>
            </div>
        )
    }
}
