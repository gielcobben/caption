import Addic7ed from 'addic7ed-api';
import { remote } from 'electron';
import { checkExtention } from '../scripts/Utility';

const { dialog } = remote;

export async function searchFile(rawFile, language) {
	const file = checkExtention(rawFile);
	const splitFileName = file.name.match(/s([0-9]{1,2})\s*e([0-9]{1,2})/i);

	if (!splitFileName) {
		throw new Error('No subtitles found.');
	}

	const serie = splitFileName.input;
	const season = parseInt(splitFileName[1], 10);
	const episode = parseInt(splitFileName[2], 10);

	const subtitles = await Addic7ed.search(serie, season, episode, language);

	console.log(`Addic7ed found ${subtitles.length} subtitles.`);

	if (!subtitles.length > 0) {
		throw new Error('No subtitles found.');
	}

	return {
		subtitles,
		file,
		source: 'addic7ed'
	};
}

export async function searchQuery(query, language) {
	const splitQuery = query.match(/s([0-9]{1,2})\s*e([0-9]{1,2})/i);

	if (!splitQuery) {
		throw new Error('No subtitles found.');
	}

	const serie = query.replace(splitQuery[0], '');
	const season = parseInt(splitQuery[1], 10);
	const episode = parseInt(splitQuery[2], 10);

	const list = await Addic7ed.search(serie, season, episode, language);

	console.log(`Addic7ed found ${list.length} subtitles.`);

	const subtitles = [];

	for (const subtitle of list) {
		subtitles.push({
			title: `${query}.${subtitle.distribution}.${subtitle.team}`,
			download: subtitle,
			extention: '',
			source: 'addic7ed',
			size: ''
		});
	}

	return {
		subtitles,
		source: 'addic7ed'
	};
}

export async function downloadQuery(item) {
	const currentWindow = remote.getCurrentWindow();

	const path = await new Promise((resolve) => {
		dialog.showSaveDialog(currentWindow, {
			title: 'Download',
			defaultPath: `${item.title}.srt`
		}, resolve);
	});

	if (!path) {
		return;
	}

	await Addic7ed.download(item.download, path);
}

export async function downloadFile(subtitle, file) {
	const filePath = file.path;
	const fileName = `${filePath.slice(0, filePath.lastIndexOf('.'))}.srt`;
	await Addic7ed.download(subtitle, fileName);
}
