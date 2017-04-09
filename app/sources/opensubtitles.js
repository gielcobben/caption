import OpenSubtitles from 'subtitler'

export async function searchFile(file, language) {
    const token = await OpenSubtitles.api.login()
    const subtitles = await OpenSubtitles.api.searchForFile(token, language, file.path)

    if (!subtitles.length > 0) {
        throw new Error('No subtitles found.');
    }

    console.log(`Opensubtitles found ${subtitles.length} subtitles.`);

    const logout = await OpenSubtitles.api.logout(token)

    return {
        subtitles,
        file,
        source: 'opensubtitles'
    }
}

export async function searchQuery(query, language) {
    const token = await OpenSubtitles.api.login()
    const rawSubtitles = await OpenSubtitles.api.search(token, language, { query: query })

    console.log(`Opensubtitles found ${rawSubtitles.length} subtitles.`);

    const subtitles = []

    for (const subtitle of rawSubtitles) {
        subtitles.push({
            title: subtitle.MovieReleaseName,
            download: subtitle.ZipDownloadLink,
            source: 'opensubtitles',
            extention: '',
            size: ''
        });
    }

    const logout = await OpenSubtitles.api.logout(token)

    return {
        subtitles,
        source: 'opensubtitles',
    }
}

export async function downloadFile(subtitle, file) {
    await OpenSubtitles.downloader.download(subtitle, 1, file.path, null)
}

export function downloadQuery(item) {
    return window.location.assign(item.download)
}