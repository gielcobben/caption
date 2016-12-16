import fs from 'fs'
import OpenSubtitles from 'subtitler'
import React, {Component} from 'react'
import SearchField from '../components/SearchField'
import Loading from '../components/Loading'
import Content from '../components/Content'

export default class Home extends Component {

    constructor(props) {
        super(props)

        this.state = {
            results: [],
            lang: 'eng',
            query: null,
            filepath: null,
            loading: false,
            visibleDropArea: true
        }

        this.search = this.search.bind(this)
        this.onDrop = this.onDrop.bind(this)
        this.resetList = this.resetList.bind(this)
        this.onQueryChange = this.onQueryChange.bind(this)
        this.onLanguageChange = this.onLanguageChange.bind(this)
    }

    search(event, type) {

        // If event, prevent default form submit
        if (event) {
            event.preventDefault()
        }

        // Only do a search if there's a query
        if (this.state.query) {

            // Enable loading
            this.setState({
                loading: true
            })

            OpenSubtitles.api.login().then((token) => {

                if (type === 'file') {

                    // Use the opensubtitles API to search for subtitles
                    OpenSubtitles.api.searchForFile(token, this.state.lang, "/Users/giel/Downloads/Halt And Catch Fire Season 3 Mp4 720p/Halt And Catch Fire S03E10.mp4").then((results) => {

                        console.log('searched.')

                        // Store results in state
                        this.setState({
                            results: results,
                            loading: false
                        })

                        // And logout when we've results
                        OpenSubtitles.api.logout(token)
                    })

                }
                else {

                    // Use the opensubtitles API to search for subtitles
                    OpenSubtitles.api.searchForTitle(token, this.state.lang, this.state.query).then((results) => {

                        // Store results in state
                        this.setState({
                            results: results,
                            loading: false
                        })

                        // And logout when we've results
                        OpenSubtitles.api.logout(token)
                    })
                }
            })
        }
    }

    onDrop(event) {
        event.preventDefault()

        // Get the dropped files
        const filesDropped = event.dataTransfer ? event.dataTransfer.files : event.target.files

        // Set file path
        this.setState({
            filepath: filesDropped[0].path
        })

        // Files processing (do this outside of React)
        if (fs.existsSync(filesDropped[0].path)) {
            const stats = fs.statSync(filesDropped[0].path)
            const isDirectory = stats.isDirectory()

            if (isDirectory) {
                console.log('is folder')
            }
            else {
                console.log('is file')
            }
        }

        console.log(filesDropped[0])
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

        // setState
        this.setState({
            query: query,
            visibleDropArea: false
        })
    }

    resetList() {

        // setState
        this.setState({
            loading: false,
            query: null,
            results: [],
            visibleDropArea: true
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
                <SearchField selectedLanguage={this.state.lang} resetList={this.resetList} submitForm={this.search} changeQuery={this.onQueryChange} changeLanguage={this.onLanguageChange} />
                {
                    this.state.loading ?
                    <Loading /> :
                    <Content visibleDropArea={this.state.visibleDropArea} onDrop={this.onDrop} results={this.state.results} />
                }
            </div>
        )
    }
}
