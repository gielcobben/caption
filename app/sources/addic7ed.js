import fs from 'fs'
import request from 'request-promise'
import Addic7ed from 'addic7ed-api'
import { remote } from 'electron'
import { ToBuffer } from '../scripts/Utility'

const { dialog } = remote
const URL = 'http://www.addic7ed.com'
const EXTENTIONS = ['3g2', '3gp', '3gp2', '3gpp', '60d', 'ajp', 'asf', 'asx', 'avchd', 'avi', 'bik', 'bix', 'box', 'cam', 'dat', 'divx', 'dmf', 'dv', 'dvr-ms', 'evo', 'flc', 'fli', 'flic', 'flv', 'flx', 'gvi', 'gvp', 'h264', 'm1v', 'm2p', 'm2ts', 'm2v', 'm4e', 'm4v', 'mjp', 'mjpeg', 'mjpg', 'mkv', 'moov', 'mov', 'movhd', 'movie', 'movx', 'mp4', 'mpe', 'mpeg', 'mpg', 'mpv', 'mpv2', 'mxf', 'nsv', 'nut', 'ogg', 'ogm', 'omf', 'ps', 'qt', 'ram', 'rm', 'rmvb', 'swf', 'ts', 'vfw', 'vid', 'video', 'viv', 'vivo', 'vob', 'vro', 'wm', 'wmv', 'wmx', 'wrap', 'wvx', 'wx', 'x264', 'xvid']

function checkFile(file) {
    const extention = file.extention

    if (EXTENTIONS.indexOf(extention) > -1) {
        return file
    }
    else {
        return false
    }

}

function searchFile(rawFile, language) {
    const file = checkFile(rawFile)
    return new Promise((resolve, reject) => {
        const splitFileName = file.name.match(/s([0-9]{1,2})\s*e([0-9]{1,2})/i)

        if (splitFileName) {
            const serie = splitFileName.input
            const season = parseInt(splitFileName[1], 10)
            const episode = parseInt(splitFileName[2], 10)

            Addic7ed.search(serie, season, episode, language)
            .then(subtitles => {
                console.log(subtitles)
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
                source: 'addic7ed'
            }))
            .then(resolve)
            .catch(reject)
        }
        else {
            return reject(new Error('No Subtitles found...'))
        }
    })
}

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
            return Addic7ed.download(item.download, savePath).then(() => {
                console.log('Subtitles file saved.')
            })
        }
        else {
            return
        }
    })
}

function downloadFile(subtitle, file, language) {
    const filePath = file.path
    const fileName = `${filePath.slice(0, filePath.lastIndexOf('.'))}.srt`
    return Addic7ed.download(subtitle, fileName).then((response) => {
        console.log('Subtitles file saved.')
    })
}

export default { searchQuery, searchFile, downloadQuery, downloadFile }