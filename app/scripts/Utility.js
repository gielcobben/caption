/*
 * Imports
 */
import fs from 'fs'
import AdmZip from 'adm-zip'
import Junk from 'junk'

const EXTENTIONS = ['3g2', '3gp', '3gp2', '3gpp', '60d', 'ajp', 'asf', 'asx', 'avchd', 'avi', 'bik', 'bix', 'box', 'cam', 'dat', 'divx', 'dmf', 'dv', 'dvr-ms', 'evo', 'flc', 'fli', 'flic', 'flv', 'flx', 'gvi', 'gvp', 'h264', 'm1v', 'm2p', 'm2ts', 'm2v', 'm4e', 'm4v', 'mjp', 'mjpeg', 'mjpg', 'mkv', 'moov', 'mov', 'movhd', 'movie', 'movx', 'mp4', 'mpe', 'mpeg', 'mpg', 'mpv', 'mpv2', 'mxf', 'nsv', 'nut', 'ogg', 'ogm', 'omf', 'ps', 'qt', 'ram', 'rm', 'rmvb', 'swf', 'ts', 'vfw', 'vid', 'video', 'viv', 'vivo', 'vob', 'vro', 'wm', 'wmv', 'wmx', 'wrap', 'wvx', 'wx', 'x264', 'xvid']

function checkExtention(file) {
    const extention = file.extention

    if (EXTENTIONS.indexOf(extention) > -1) {
        return file
    }
    else {
        return false
    }

}

/*
 * Process Files
 */
const CheckFiles = (filesDropped, callback) => {

    const files = []
    let isDirectory

    // Loop trough each dropped file
    for (let i = 0; i < filesDropped.length; i++) {

        const file = filesDropped[i]

        // Check if path exists
        if (fs.existsSync(file.path)) {

            // Check if it's a directory
            const stats = fs.statSync(file.path)
            isDirectory = stats.isDirectory()

            // It's a directory
            if (isDirectory) {
                fs.readdirSync(file.path).map(fileInDirectory => {
                    
                    // Get stats for each file in directory so we can add the size of the file in the object instead of the size of the folder.
                    const fileName = fileInDirectory
                    const filePath = `${file.path}/${fileInDirectory}`
                    const fileInDirectoryStats = fs.statSync(filePath)
                    const fileSize = fileInDirectoryStats.size
                    const fileExtention = fileName.substr(fileName.lastIndexOf('.') + 1)

                    if (Junk.is(fileInDirectory)) {
                        // Check if file is junk (Think on files like DS_Store ect..)
                        return false
                    }
                    else {

                        // Map and push the file object in array
                        const fileObject = {
                            extention: fileExtention,
                            size: fileSize,
                            name: fileName,
                            path: filePath,
                            status: 'loading'
                        }

                        // Push
                        files.push(fileObject)

                    }

                })
            }
            // It's a file
            else {

                // Get extention for file name
                const fileExtention = file.name.substr(file.name.lastIndexOf('.') + 1)

                // If file is just a file, push the file object in array
                const fileObject = {
                    extention: fileExtention,
                    size: file.size,
                    name: file.name,
                    path: file.path,
                    status: 'loading'
                }

                // Push
                files.push(fileObject)

            }
        }

    }

    return { files, isDirectory }
}

/*
 * To Buffer
 */
const ToBuffer = (arrayBuffer) => {
    const buf = new Buffer(arrayBuffer.byteLength)
    const view = new Uint8Array(arrayBuffer)

    for (let i = 0; i < buf.length; i++) {
        buf[i] = view[i]
    }

    return buf
}

/*
 * Download Subtitle
 */
function DownloadSubtitles(subDownloadLink, file, subFileName, newFilename, callback) {

    return new Promise((resolve, reject) => {
        fetch(subDownloadLink)
            .then(response => {

                // Get arrayBuffer
                return response.arrayBuffer()
            })
            .then(arrayBuffer => {

                // Convert to Buffer
                return ToBuffer(arrayBuffer)
            })
            .then(buffer => {

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
                    }

                })
            })
            .then(resolve)
            .catch(reject)
    })

}

/*
 * Human File Size
 */
const humanFileSize = (bytes, si) => {
    let thresh = si ? 1000 : 1024

    if (Math.abs(bytes) < thresh) {
        return `${bytes} B`
    }

    const units = si ?
        ['kB','MB','GB','TB','PB','EB','ZB','YB'] :
        ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB']

    let u = -1

    do {
        bytes /= thresh
        ++u
    } while (Math.abs(bytes) >= thresh && u < units.length - 1)

    return `${bytes.toFixed(1)} ${units[u]}`
}

/*
 * Export all functions
 */
export {CheckFiles, checkExtention, ToBuffer, DownloadSubtitles, humanFileSize}
