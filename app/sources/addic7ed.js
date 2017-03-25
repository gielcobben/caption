import request from 'request-promise'
import $ from 'cheerio'

const URL = 'http://www.addic7ed.com'

function search(query) {
	return new Promise((resolve, reject) => {
		// search addic7ed
		request({
			uri: `${URL}/search.php?search=${encodeURIComponent('New Girl S01E02')}`,
		})
		.then((html) => {
			const urlRegexp = new RegExp(/(?:href="(\/(?:original).+)")/g)
			const subtitles = []
			let urlMatch

			while ((urlMatch = urlRegexp.exec(html)) !== null) {
				subtitles.push({ url: `${URL}${urlMatch[1]}` })
			}

			console.log($(html).find('td[class="NewsTitle"]'))

			if (!subtitles.length) {
				throw new Error('No subtitles found.')
			}

			// console.log(html)

			return {
				subtitles,
				source: 'addic7ed',
			}
		})
		.then(resolve)
		.catch(reject);
	})
}

export default { search };