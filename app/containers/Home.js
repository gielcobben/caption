import './Home.scss'
import path from 'path'
import OpenSubtitles from 'subtitler'
import List from '../components/List'
import React, {Component} from 'react'
import Storage from 'electron-json-storage'
import Loading from '../components/Loading'
import Dropzone from '../components/Dropzone'
import Settings from '../components/Settings'
import EmptyList from '../components/EmptyList'
import SearchField from '../components/SearchField'
import {CheckFiles, ToBuffer, DownloadSubtitles} from '../scripts/Utility'

export default class Home extends Component {

    constructor(props) {
        super(props)
        this.state = {
            query: '',
            lang: 'eng',
            files: [],
            results: [],
            loading: false,
            dragging: false,
            dropzoneText: 'Drop an episode or season…'
        }
        this.onDrop = this.onDrop.bind(this)
        this.onDragEnter = this.onDragEnter.bind(this)
        this.onDragLeave = this.onDragLeave.bind(this)
        this.onDragOver = this.onDragOver.bind(this)
        this.resetList = this.resetList.bind(this)
        this.onKeyPress = this.onKeyPress.bind(this)
        this.onQueryChange = this.onQueryChange.bind(this)
        this.searchForFiles = this.searchForFiles.bind(this)
        this.searchForTitle = this.searchForTitle.bind(this)
        this.onLanguageChange = this.onLanguageChange.bind(this)
    }

    setFileStatus(index, status) {
        if (this.state.files.length > 0) {
            this.setState({
                files: [
                    ...this.state.files.slice(0, index),
                    { ...this.state.files[index], status },
                    ...this.state.files.slice(index + 1),
                ]
            })
        }
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
                            this.setFileStatus(index, 'done');
                        })
                    }
                    else {
                        this.setFileStatus(index, 'failed');
                    }

                }).catch(error => {
                    console.log(error)
                })
            })
            return token
        }).then(token => {
             OpenSubtitles.api.logout(token)
        }).catch(error => {
            console.log(error)
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

    onDragEnter(event) {
        this.setState({
            dragging: true
        })
    }

    onDragLeave() {
        if (this.state.dragging) {
            this.setState({
                dragging: false
            })
        }
    }

    onDragOver() {
        if (!this.state.dragging) {
            this.setState({
                dragging: true
            })
        }
    }

    getFilePath(isDirectory, fileDropped) {
        if (isDirectory) {
            return fileDropped.path
        }
        else {
            return path.dirname(fileDropped.path)
        }
    }

    onDrop(event) {
        // Prevent Default
        event.preventDefault()

        // Get the dropped files
        const filesDropped = event.dataTransfer ? event.dataTransfer.files : event.target.files

        // Process dropped path
        const { files, isDirectory } = CheckFiles(filesDropped)

        // If files
        if (files.length > 0) {
            const filePath = this.getFilePath(isDirectory, filesDropped[0])
            const query = filePath.substr(filePath.lastIndexOf('/') + 1)

            if (this.state.files.length > 0) {
                //Add to current array
                this.setState({
                    query: query,
                    results: [],
                    files: files,
                    dragging: false
                }, () => {
                    this.searchForFiles()
                })
            }
            else {
                // New Array with files
                this.setState({
                    query: query,
                    results: [],
                    files: files,
                    dragging: false
                }, () => {
                    this.searchForFiles()
                })
            }

        }
        // If the file is too small, do nothing
        else {
            this.setState({
                dragging: false
            })
        }
    }

    onLanguageChange(lang) {
        Storage.set('language', lang, (error) => {
            if (error) throw error
        })

        this.setState({
            lang
        })

        // Search again
        if (this.state.results.length > 0) {
            this.searchForTitle()
        }
        else {
            // Set the new loading state and search again
            this.setState({
                files: this.state.files.map((file) => {
                    return { ...file, status: 'loading' }
                })
            }, () => {
                this.searchForFiles()
            })

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

            if (Object.keys(lang).length === 0 && lang.constructor === Object) {
                this.setState({
                    lang: 'eng'
                })
            }
            else {
                this.setState({
                    lang: lang
                })
            }
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
            content = <List textSearch={true} results={this.state.results} resetList={this.resetList} onDrop={this.onDrop} />
        }
        // If there are files dropped show the list with files
        // (FileSearch state)
        else if (this.state.files.length > 0) {
            content = <List fileSearch={true} results={this.state.files} resetList={this.resetList} onDrop={this.onDrop} />
        }
        // If the query is empty show the dropzone
        // (Home state)
        else if (this.state.query === '') {
            content = <Dropzone onDrop={this.onDrop} onDragEnter={this.onDragEnter} onDragLeave={this.onDragLeave} onDragOver={this.onDragOver} dragging={this.state.dragging} />
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
                    resetList={this.resetList}
                    submitForm={this.searchForTitle}
                    changeQuery={this.onQueryChange}
                    defaultValue={this.state.query}
                    showReset={!this.state.visibleDropArea}
                />
                <Settings
                    query={this.state.query}
                    selectedLanguage={this.state.lang}
                    changeLanguage={this.onLanguageChange}
                    results={this.state.results}
                    files={this.state.files}
                    resetList={this.resetList}
                />
                <section className={`content-wrapper`}>
                    {content}
                </section>
            </div>
        )
    }
}
