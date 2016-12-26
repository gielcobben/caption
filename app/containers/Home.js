import OpenSubtitles from 'subtitler'
import React, {Component} from 'react'
import Loading from '../components/Loading'
import Content from '../components/Content'
import SearchField from '../components/SearchField'
import {CheckFiles, ToBuffer, DownloadSubtitles} from '../scripts/Utility'

export default class Home extends Component {

    constructor(props) {
        super(props)

        this.state = {
            query: '',
            lang: 'eng',
            files: null,
            results: [],
            loading: false,
            visibleDropArea: true
        }

        this.onDrop = this.onDrop.bind(this)
        this.resetList = this.resetList.bind(this)
        this.onQueryChange = this.onQueryChange.bind(this)
        this.searchForFiles = this.searchForFiles.bind(this)
        this.searchForTitle = this.searchForTitle.bind(this)
        this.onLanguageChange = this.onLanguageChange.bind(this)
    }

    searchForFiles() {
        const files = this.state.files

        this.setState({
            loading: true
        })

        OpenSubtitles.api.login().then(token => {

            // Loop trough each dropped file
            files.map((file, index) => {

                // Search by file
                OpenSubtitles.api.searchForFile(token, this.state.lang, file.path).then(results => {

                    // If results, get download link and filename
                    const subDownloadLink = results[0].ZipDownloadLink
                    const subFileName = results[0].SubFileName

                    // Remove extention from video filename so we can use this as the new subtitle filename
                    const extention = file.name.substr(file.name.lastIndexOf('.') + 1)
                    const newFilename = file.name.replace(`.${extention}`, '')

                    // Download
                    DownloadSubtitles(subDownloadLink, file, subFileName, newFilename, () => {
                        // Done.
                        this.setState({
                            loading: false
                        })
                    })

                })

                // Logout when the last result is in.
                if (index === files.length - 1) {
                    OpenSubtitles.api.logout(token)
                }

            })

        })

    }

    searchForTitle(event) {

        // Prevent default form submit
        if (event) {
            event.preventDefault()
        }

        // Only do a search if there's a query
        if (this.state.query) {

            // Enable loading
            this.setState({
                loading: true
            })

            // Use the opensubtitles API to search for subtitles
            OpenSubtitles.api.login().then((token) => {
                OpenSubtitles.api.searchForTitle(token, this.state.lang, this.state.query).then((results) => {

                    // Store results in state
                    this.setState({
                        results: results,
                        loading: false
                    })

                    // And logout when we've results
                    OpenSubtitles.api.logout(token)
                })
            })
        }
    }

    onDrop(event) {
        // Prevent Default
        event.preventDefault()

        // Get the dropped files
        const filesDropped = event.dataTransfer ? event.dataTransfer.files : event.target.files

        // Process dropped path
        CheckFiles(filesDropped, (files) => {

            this.setState({
                files: files
            }, () => {
                this.searchForFiles()
            })

        })
    }

    onLanguageChange(lang) {
        this.setState({
            lang: lang
        })

        if (this.state.files) {
            this.searchForFiles()
        }
        else {
            this.searchForTitle()
        }
    }

    onQueryChange(query) {
        this.setState({
            files: null,
            query: query,
            visibleDropArea: false
        })
    }

    resetList() {
        this.setState({
            query: '',
            results: [],
            files: null,
            loading: false,
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
                <SearchField selectedLanguage={this.state.lang} resetList={this.resetList} submitForm={this.searchForTitle} changeQuery={this.onQueryChange} changeLanguage={this.onLanguageChange} defaultValue={this.state.query} />
                <Content loading={this.state.loading} visibleDropArea={this.state.visibleDropArea} onDrop={this.onDrop} results={this.state.results} />
            </div>
        )
    }
}
