/*
 * Imports
 */
import fs from 'fs'
import AdmZip from 'adm-zip'

/*
 * Process Files
 */
const CheckFiles = (filesDropped, callback) => {

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

    return callback(files)
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
 * Export all functions
 */
export {CheckFiles, ToBuffer, DownloadSubtitles}
