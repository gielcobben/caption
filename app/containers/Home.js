import fs from 'fs'
import AdmZip from 'adm-zip'
import OpenSubtitles from 'subtitler'
import React, {Component} from 'react'
import SearchField from '../components/SearchField'
import Loading from '../components/Loading'
import Content from '../components/Content'

const checkFiles = (path, callback) => {

    if (fs.existsSync(path)) {

        const stats = fs.statSync(path)
        const isDirectory = stats.isDirectory()

        if (isDirectory) {
            console.log('is folder')

            fs.readdir(path, (error, filesInDirectory) => {
                return callback('directory', filesInDirectory)
            })

        }
        else {
            console.log('is file')
            return callback('singleFile', false)
        }

    }
}

export default class Home extends Component {

    constructor(props) {
        super(props)

        this.state = {
            results: [],
            lang: 'eng',
            query: null,
            files: null,
            filePath: null,
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
        console.log('search for file')
        console.log(this.state.files)
        console.log(this.state.filePath)

        const path = this.state.filePath
        const files = this.state.files

        this.setState({
            loading: true
        })

        OpenSubtitles.api.login().then(token => {

            files.map((file, index) => {

                OpenSubtitles.api.searchForFile(token, this.state.lang, `${path}/${file}`).then(results => {

                    // fs.createReadStream(results[0].ZipDownloadLink).pipe(unzip.Extract({ path: path }))

                    fetch(results[0].ZipDownloadLink).then(response => {
                        console.log(response)
                        console.log(response.body)
                        // response.body.on('data', chunk => {
                        //     console.log(chunk)
                        // })
                    })

                })

                // Logout when the last result is in.
                if (index == files.length - 1) {
                    OpenSubtitles.api.logout(token)

                    this.setState({
                        loading: false
                    })
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

        // Set file path
        this.setState({
            filePath: filesDropped[0].path
        })

        // Process dropped path
        checkFiles(filesDropped[0].path, (type, files) => {
            if (type === 'directory') {

                this.setState({
                    files: files
                })

                this.searchForFiles()
            }
            else {
                // single file
            }
        })
    }

    onLanguageChange(lang) {
        this.setState({
            lang: lang
        })
        this.searchForTitle()
    }

    onQueryChange(query) {
        this.setState({
            query: query,
            visibleDropArea: false
        })
    }

    resetList() {
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
                <SearchField selectedLanguage={this.state.lang} resetList={this.resetList} submitForm={this.searchForTitle} changeQuery={this.onQueryChange} changeLanguage={this.onLanguageChange} />
                {
                    this.state.loading ?
                    <Loading /> :
                    <Content visibleDropArea={this.state.visibleDropArea} onDrop={this.onDrop} results={this.state.results} />
                }
            </div>
        )
    }
}
