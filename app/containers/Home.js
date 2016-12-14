import OpenSubtitles from 'subtitler'
import React, {Component} from 'react'
import SearchField from '../components/SearchField'
import Loading from '../components/Loading'
import List from '../components/List'

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

    searchSubtitle(query, language) {
        // Check is there's an query
        if (query) {

            // Set loading to True
            this.setState({
                loading: true,
                query: query,
                lang: language
            })

            OpenSubtitles.api.login().then((token) => {
                // Use the opensubtitles API to search for subtitles
                OpenSubtitles.api.searchForTitle(token, language, query).then((results) => {
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
        // Prevent Default
        input.preventDefault()

        console.log('go')

        // Readable value
        const query = input.target.querySelector('input').value

        console.log(this.props.language)

        // // Get language from storage with callback because it takes a while...
        // getLanguage((language) => {
        //
        //     // Search if there's an value and it's not search already.
        //     // if (value && !this.state.loading) {
        //     if (query) {
        //         this.searchSubtitle(query, language)
        //         console.log(`Searching For: ${query} lang: ${language}`)
        //     }
        // })
    }

    render() {
        // Construct circle icon
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
