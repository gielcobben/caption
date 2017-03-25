import OpenSubtitles from 'subtitler'

function search(query, language) {

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

function download(item) {
    return window.location.assign(item.download)
}

export default { search, download }