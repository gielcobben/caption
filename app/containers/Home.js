import OpenSubtitles from 'subtitler'
import React, {Component} from 'react'
import Storage from 'electron-json-storage'
import Loading from '../components/Loading'
import Content from '../components/Content'
import SearchField from '../components/SearchField'
import Dropzone from '../components/Dropzone'
import EmptyList from '../components/EmptyList'
import List from '../components/List'
import {CheckFiles, ToBuffer, DownloadSubtitles} from '../scripts/Utility'

export default class Home extends Component {

    constructor(props) {
        super(props)
        this.state = {
            query: '',
            lang: 'all',
            files: [],
            results: [],
            loading: false
        }
        this.onDrop = this.onDrop.bind(this)
        this.resetList = this.resetList.bind(this)
        this.onKeyPress = this.onKeyPress.bind(this)
        this.onQueryChange = this.onQueryChange.bind(this)
        this.searchForFiles = this.searchForFiles.bind(this)
        this.searchForTitle = this.searchForTitle.bind(this)
        this.onLanguageChange = this.onLanguageChange.bind(this)
    }

    searchForFiles() {
        const files = this.state.files

        OpenSubtitles.api.login().then(token => {

            // Loop trough each dropped file
            files.map((file, index) => {

                // Search by file
                OpenSubtitles.api.searchForFile(token, this.state.lang, file.path).then(results => {

                    if (results.length !== 0) {

                        // If results, get download link and filename
                        const subDownloadLink = results[0].ZipDownloadLink
                        const subFileName = results[0].SubFileName

                        // Remove extention from video filename so we can use this as the new subtitle filename
                        const extention = file.name.substr(file.name.lastIndexOf('.') + 1)
                        const newFilename = file.name.replace(`.${extention}`, '')

                        // Download
                        DownloadSubtitles(subDownloadLink, file, subFileName, newFilename, () => {
                            // Set loading for specific file to false
                            this.state.files[index].status = 'done'

                            // Update whole state with the false set to the item
                            this.setState({
                                files: this.state.files
                            })
                        })
                    }
                    else {

                        this.state.files[index].status = 'failed'

                        this.setState({
                            files: this.state.files
                        })

                        // this.resetList()
                        // this.setState({
                        //     loading: false,
                        //     // visibleDropArea: false
                        // })
                    }

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
                        files: [],
                        loading: false,
                        results: results,
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
                query: '',
                results: [],
                files: files
            }, () => {
                this.searchForFiles()
            })

        })
    }

    onLanguageChange(lang) {
        Storage.set('language', lang, (error) => {
            if (error) throw error
        })

        this.setState({
            lang: lang
        })

        if (!this.state.files) {
            this.searchForTitle()
        }
    }

    onQueryChange(query) {
        this.setState({
            files: [],
            query: query,
        })
    }

    resetList() {
        this.setState({
            files: [],
            query: '',
            results: [],
            loading: false,
        })
    }

    onKeyPress(event) {
        if (event.keyCode === 27) {
            this.resetList()
        }
    }

    componentWillMount() {
        Storage.get('language', (error, lang) => {
            this.setState({
                lang: lang
            })
        })
    }

    componentDidMount() {
        document.addEventListener('keydown', this.onKeyPress)
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.onKeyPress)
    }

    render() {
        // Content
        let content

        // Construct circle icon
        const circle = (
            <svg x="0px" y="0px" width="25px" height="25px" viewBox="0 0 25 25">
                <circle cx="12.5" cy="12.5" r="12.5"/>
            </svg>
        )

        // If loading is true or if there are results and loading is true
        // (Loading state)
        if (this.state.loading) {
            content = <Loading />
        }
        // If there are results show the list with results
        // (TextSearch State)
        else if (this.state.results.length > 0) {
            content = <List textSearch={true} results={this.state.results} />
        }
        // If there are files dropped show the list with files
        // (FileSearch state)
        else if (this.state.files.length > 0 && this.state.query === '') {
            content = <List fileSearch={true} results={this.state.files} />
        }
        // If the query is empty show the dropzone
        // (Home state)
        else if (this.state.query === '') {
            content = <Dropzone onDrop={this.onDrop} />
        }
        // Everything else, show an empty list
        // (Typing... state)
        else {
            content = <EmptyList />
        }

        // Render
        return (
            <div className="wrapper">
                <SearchField
                    selectedLanguage={this.state.lang}
                    resetList={this.resetList}
                    submitForm={this.searchForTitle}
                    changeQuery={this.onQueryChange}
                    changeLanguage={this.onLanguageChange}
                    defaultValue={this.state.query}
                    showReset={!this.state.visibleDropArea}
                />
                <section className={`content-wrapper`}>
                    {content}
                </section>
            </div>
        )
    }
}
