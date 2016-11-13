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
        this.onSearch = this.onSearch.bind(this)
        this.state = {
            loading: false,
            query: null,
            lang: 'eng',
            results: []
        }
    }

    searchSubtitle(query) {
        // Check is there's an query
        if (query) {

            // Set loading to True
            this.setState({
                loading: true,
                query: query
            })

            OpenSubtitles.api.login().then((token) => {
                // Use the opensubtitles API to search for subtitles
                OpenSubtitles.api.searchForTitle(token, this.state.lang, query).then((results) => {
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

        // Search if there's an value and it's not search already.
        // if (value && !this.state.loading) {
        if (query) {
            this.searchSubtitle(query)
            console.log(`Searching For: ${query}`)
        }
    }

    render() {
        const circle = (
            <svg x="0px" y="0px" width="25px" height="25px" viewBox="0 0 25 25">
                <circle cx="12.5" cy="12.5" r="12.5"/>
            </svg>
        )

        // Render
        return (
            <div className="wrapper">
                <SearchField onSearch={this.onSearch} />
                {
                    this.state.loading ?
                    <Loading /> :
                    <List results={this.state.results} />
                }
            </div>
        )
    }
}
