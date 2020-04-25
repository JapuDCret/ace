import { CSVToArray } from 'app/utils/CSVToArray';

export async function readCsvFile(uri: string, skipFirstLine = true): Promise<string[][]> {
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
}
