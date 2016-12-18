import fs from 'fs'
import AdmZip from 'adm-zip'
import OpenSubtitles from 'subtitler'
import React, {Component} from 'react'
import SearchField from '../components/SearchField'
import Loading from '../components/Loading'
import Content from '../components/Content'

const checkFiles = (filesDropped, callback) => {

    const files = []

    // Loop trough each dropped file
    for (let i = 0; i < filesDropped.length; i++) {

        const file = filesDropped[i]

        // Check if path exists
        if (fs.existsSync(file.path)) {

            const stats = fs.statSync(file.path)
            const isDirectory = stats.isDirectory()

            if (isDirectory) {

                // Read files in directory
                fs.readdir(file.path, (error, filesInDirectory) => {

                    filesInDirectory.map(fileInDirectory => {

                        // Map and push the file object in array
                        const fileObject = {
                            name: fileInDirectory,
                            path: `${file.path}/${fileInDirectory}`
                        }

                        files.push(fileObject)

                    })
                })
            }
            else {

                // If file is just a file, push the file object in array
                const fileObject = {
                    name: file.name,
                    path: file.path
                }

                files.push(fileObject)

            }
        }

    }

    callback(files)
}

const toBuffer = (arrayBuffer) => {
    const buf = new Buffer(arrayBuffer.byteLength)
    const view = new Uint8Array(arrayBuffer)

    for (let i = 0; i < buf.length; i++) {
        buf[i] = view[i]
    }

    return buf
}

const downloadSubtitle = (subDownloadLink, file, subFileName, newFilename, callback) => {

    // Download the subtitle
    fetch(subDownloadLink).then(response => {

        // Get arrayBuffer
        return response.arrayBuffer()
    }).then(arrayBuffer => {

        // Convert to Buffer
        return toBuffer(arrayBuffer)
    }).then(buffer => {

        // Process file
        const zip = new AdmZip(buffer)
        const zipEntries = zip.getEntries()

        // Map files in zip
        zipEntries.map(zipEntry => {

            // Search for the .srt file inside the zip
            if (zipEntry.entryName === subFileName) {

                // remove file.name from file.path to get the right directoryPath
                const directoryPath = file.path.replace(file.name, '')

                // Extract srt file
                zip.extractEntryTo(zipEntry.entryName, directoryPath, false, true)

                // Rename subtitle file to the same filename as the video
                fs.rename(`${directoryPath}/${subFileName}`, `${directoryPath}/${newFilename}.srt`)

                callback()
            }

        })
    })
}

export default class Home extends Component {

    constructor(props) {
        super(props)

        this.state = {
            results: [],
            lang: 'eng',
            query: '',
            files: null,
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
                    downloadSubtitle(subDownloadLink, file, subFileName, newFilename, () => {
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
        checkFiles(filesDropped, (files) => {

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
                {
                    this.state.loading ?
                    <Loading /> :
                    <Content visibleDropArea={this.state.visibleDropArea} onDrop={this.onDrop} results={this.state.results} />
                }
            </div>
        )
    }
}
