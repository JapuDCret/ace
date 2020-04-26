import { CSVToArray } from 'app/utils/CSVToArray';

export const readCsvFile = async (uri: string, skipFirstLine = true): Promise<string[][]> => {
	const response = await fetch(uri);
	if (!response.ok) {
		throw Error('response was not ok: ' + response);
	}

	let csvData = await response.text();

	if (csvData === undefined) {
		throw Error('csvData is undefined');
	}

	csvData = csvData.trim();

	if (skipFirstLine) {
		const firstLineBreakPos = csvData.indexOf('\n');

		csvData = csvData.substring(firstLineBreakPos + 1);
	}

	// const lastLineBreakPos = csvData.lastIndexOf('\n');
	// if (lastLineBreakPos === csvData.length) {
	//     csvData.substring(0, lastLineBreakPos - 1);
	// }

	const jsonData = CSVToArray(csvData, ';');

	console.log('jsonData = ', jsonData);

	return jsonData;
};

type Dictionary<T> = {
	[key: string]: T
};

export const mapFilesToDictionary = (context: __WebpackModuleApi.RequireContext, prefixToRemove: string | undefined): Dictionary<string> => {
	const fileMap: Dictionary<string> = {};

	context.keys().forEach((key) => {
		let id = key.split('./').pop() // remove the first 2 characters
		if (id === undefined) {
			console.error(`could not import image "${key}"`);
			return;
		}

		id = id.substring(0, key.length - 6); // remove the file extension
		if (prefixToRemove !== undefined) {
			id = id.substring(prefixToRemove.length);
		}

		fileMap[id] = context(key);
	});

	return fileMap;
};