import * as serviceWorker from './serviceWorker';

import './assets/css/fira_minimal.css';

import './index.sass';

import * as React from 'react';
import ReactDOM from 'react-dom';

import Renderer from 'app/renderer';

import { CSVToArray } from 'app/utils/CSVToArray';

import * as fishDataCsv from './assets/data/fish.csv';

fetch(fishDataCsv)
.then((response) => {
	if (response.ok) {
		return response.text();
	}

	throw Error('response was not ok: ' + response);
})
.then((data) => {
	const csvData = data;
	
	console.log('csvData = ', csvData);
	
	if(csvData) {
		const jsonData = CSVToArray(csvData, ';');
		
		console.log('jsonData = ', jsonData);
	}
});


async function run(): Promise<void> {

	let renderer = (
		<Renderer
		/>
	);

	ReactDOM.render(renderer, document.getElementById('root'));
}

run();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
