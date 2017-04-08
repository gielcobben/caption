import OpenSubtitles from 'subtitler'
import Promise from 'bluebird'

function searchFile(file, language) {
    return new Promise((resolve, reject) => {
        OpenSubtitles.api.login()
            .then(token => {
                OpenSubtitles.api.searchForFile(token, language, file.path)
                    .then(subtitles => {
                        console.log(`Opensubtitles found ${subtitles.length} subtitles.`);
                        // If no results found, set file to status: failed
                        if (!subtitles.length > 0) {
                            return reject(new Error('No Subtitles found...'))
                        }
                        else {
                            return subtitles
                        }
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

function searchQuery(query, language) {
    return new Promise((resolve, reject) => {
        OpenSubtitles.api.login()
            .then(token => {
                OpenSubtitles.api.search(token, language, {
                    query: query
                })
                    .then(subtitles => {
                        console.log(`Opensubtitles found ${subtitles.length} subtitles.`);
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
                        // console.log(subtitles)
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

function downloadFile(subtitles, file) {
    OpenSubtitles.downloader.download(subtitles, 1, file.path, null)
}

function downloadQuery(item) {
    return window.location.assign(item.download)
}

export default { searchQuery, searchFile, downloadQuery, downloadFile }