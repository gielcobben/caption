/*
 * Imports
 */
import fs from 'fs'
import AdmZip from 'adm-zip'
import Junk from 'junk'

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

                // Read files in directory
                fs.readdir(file.path, (error, filesInDirectory) => {

                    filesInDirectory.map(fileInDirectory => {
                        
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

    return callback(files, isDirectory)
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
const DownloadSubtitles = (subDownloadLink, file, subFileName, newFilename, callback) => {

    // Download the subtitle
    fetch(subDownloadLink).then(response => {

        // Get arrayBuffer
        return response.arrayBuffer()
    }).then(arrayBuffer => {

        // Convert to Buffer
        return ToBuffer(arrayBuffer)
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

                return callback()
            }

        })
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
export {CheckFiles, ToBuffer, DownloadSubtitles, humanFileSize}
