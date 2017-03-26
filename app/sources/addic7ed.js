import Addic7ed from 'addic7ed-api'
import { remote } from 'electron'

const { dialog } = remote

function searchQuery(query, language) {
    return new Promise((resolve, reject) => {
        
        const splitQuery = query.match(/s([0-9]{1,2})\s*e([0-9]{1,2})/i)
        
        if (splitQuery) {
            const serie = query.replace(splitQuery[0], '')
            const season = parseInt(splitQuery[1], 10)
            const episode = parseInt(splitQuery[2], 10)

            Addic7ed.search(serie, season, episode, language)
            .then(subtitleList => {
                const subtitles = []
                subtitleList.map(subtitle => {
                    subtitles.push({
                        title: `${query}.${subtitle.distribution}.${subtitle.team}`,
                        download: subtitle,
                        extention: '',
                        source: 'addic7ed',
                        size: ''
                    })
                })
                console.log(subtitles)
                return subtitles
            })
            .then(subtitles => ({
                subtitles,
                source: 'addic7ed'
            }))
            .then(resolve)
            .catch(reject)
        }
        else {
            throw new Error('No subtitles found.');
        }

    })

}

function downloadQuery(item) {
    const currentWindow = remote.getCurrentWindow()
    dialog.showSaveDialog(currentWindow, {
        title: 'Download',
        defaultPath: `${item.title}.srt`
    }, (savePath) => {
        if (savePath) {
            return Addic7ed.download(item.download, savePath).then(function () {
                console.log('Subtitles file saved.');
            })
        }
        else {
            return
        }
    })
}

export default { searchQuery, downloadQuery }