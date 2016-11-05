import OpenSubtitles from 'subtitler'
import React, {Component} from 'react'
import Storage from 'electron-json-storage'
import SearchField from '../components/SearchField'
import Loading from '../components/Loading'
import List from '../components/List'

const getLanguage = () => {
    Storage.get('language', (error, data) => {
        if (error) console.log(error)
        return data.lang
    })
}

export default class Home extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            query: null,
            lang: 'eng',
            results: []
        }
    }

    searchSubtitle() {
        // Check is there's an query
        if (this.state.query) {

            // Set loading to True
            this.setState({
                loading: true
            })

            OpenSubtitles.api.login().then((token) => {
                // Use the opensubtitles API to search for subtitles
                OpenSubtitles.api.searchForTitle(token, this.state.lang, this.state.query).then((results) => {
                    // Store results in state
                    this.setState({
                        results: results,
                        loading: false
                    })
                })
            })
        }
    }

    onSearch(input) {
        input.preventDefault()

        // Readable value
        const query = input.target.querySelector('input').value
        const language = getLanguage()

        // Set query
        this.setState({
            query: query
        })

        // Search if there's an value and it's not search already.
        // if (value && !this.state.loading) {
        if (this.state.query) {
            this.searchSubtitle()
            console.log(`Searching For: ${this.state.query}`)
        }
    }

    render() {
        const circle = (
            <svg x="0px" y="0px" width="25px" height="25px" viewBox="0 0 25 25">
                <circle cx="12.5" cy="12.5" r="12.5"/>
            </svg>
        )

        // Variables
        let content

        // Show loading when state is loading...
        if (this.state.loading) {
            content = <Loading />
        }
        // Else, show the list with results
        else {
            content = <List results={this.state.results} />
        }

        // Render
        return (
            <div className="wrapper">
                <SearchField onSearch={this.onSearch.bind(this)} />
                {content}
            </div>
        )
    }
}
