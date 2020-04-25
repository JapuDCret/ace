import * as serviceWorker from './serviceWorker';

import './assets/css/fira_minimal.css';

import './index.sass';

import * as React from 'react';
import ReactDOM from 'react-dom';

import Renderer from 'app/renderer';

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
