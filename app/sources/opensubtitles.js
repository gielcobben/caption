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

export default { search }