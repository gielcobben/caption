import OpenSubtitles from 'subtitler'
import React, {Component} from 'react'
import SearchField from '../components/SearchField'
import Loading from '../components/Loading'
import List from '../components/List'

export default class Home extends Component {

    constructor(props) {
        super(props)

        this.state = {
            loading: false,
            query: null,
            lang: 'eng',
            results: []
        }

        this.resetList = this.resetList.bind(this)
        this.search = this.search.bind(this)
        this.onLanguageChange = this.onLanguageChange.bind(this)
        this.onQueryChange = this.onQueryChange.bind(this)
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

    search(event) {

        if (event) {
            event.preventDefault()    
        }

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

    onLanguageChange(lang) {
        // setState
        this.setState({
            lang: lang
        })

        // Search
        this.search()
    }

    onQueryChange(query) {
        this.setState({
            query: query
        })
    }

    resetList() {
        this.setState({
            results: []
        })
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
                <SearchField resetList={this.resetList} submitForm={this.search} changeQuery={this.onQueryChange} changeLanguage={this.onLanguageChange} />
                {
                    this.state.loading ?
                    <Loading /> :
                    <List results={this.state.results} />
                }
            </div>
        )
    }
}
