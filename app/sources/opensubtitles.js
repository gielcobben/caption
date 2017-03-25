import OpenSubtitles from 'subtitler'
import Promise from 'bluebird';
import {CheckFiles, ToBuffer, DownloadSubtitles} from '../scripts/Utility'

function searchFile(file, language) {
    
    return new Promise((resolve, reject) => {
        OpenSubtitles.api.login()
        .then(token => {
            OpenSubtitles.api.searchForFile(token, language, file.path)
                .then(subtitles => {
                    if (!subtitles.length) {
                        reject('No results')
                    }
                    return subtitles
                })
                .then(subtitles => ({
                    subtitles,
                    file,
                    source: 'opensubtitles',
                }))
                .then(resolve)
                .catch(reject)
        })
    })

}

function downloadFile(subtitles, file, callback) {

    const downloadLink = subtitles[0].ZipDownloadLink
    const filename = subtitles[0].SubFileName
    const extention = file.name.substr(file.name.lastIndexOf('.') + 1)
    const newFilename = file.name.replace(`.${extention}`, '')

    DownloadSubtitles(downloadLink, file, filename, newFilename)
    .then(() => {
        callback()
    })

}

function searchQuery(query, language) {

    return new Promise((resolve, reject) => {
        OpenSubtitles.api.login()
        .then(token => {
            OpenSubtitles.api.search(token, language, {
                query: query
            })
            .then(subtitles => {
                if (!subtitles.length) {
                    reject('No results')
                }
                return subtitles
            })
            .then(subtitles => {
                const processedSubtitles = []
                subtitles.map(subtitle => {
                    processedSubtitles.push({
                        title: subtitle.MovieReleaseName,
                        download: subtitle.ZipDownloadLink,
                        source: 'opensubtitles',
                        extention: '',
                        size: ''
                    })
                })
                return processedSubtitles
            })
            .then(subtitles => {
                console.log(subtitles)
                OpenSubtitles.api.logout(token)
                return subtitles
            })
            .then(subtitles => ({
                subtitles,
                source: 'opensubtitles',
            }))
            .then(resolve)
            .catch(reject)
        })
    })
    
}

function downloadQuery(item) {
    return window.location.assign(item.download)
}

export default { searchQuery, searchFile, downloadQuery, downloadFile }