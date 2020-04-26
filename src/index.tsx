import * as serviceWorker from './serviceWorker';

import './assets/css/fira_minimal.css';

import './index.sass';

import * as React from 'react';
import ReactDOM from 'react-dom';

import Renderer from 'app/renderer';

async function run(): Promise<void> {
	const debug = process.env.DEBUG || false;
	const isProd = process.env.PRODUCTION || false;
	const basePath = process.env.REACT_APP_ROUTER_BASE || '';

	console.log('debug = ', debug);
	console.log('isProd = ', isProd);
	console.log('basePath = ', basePath);

	let renderer = (
		<Renderer
			basePath={basePath}
		/>
	);

	ReactDOM.render(renderer, document.getElementById('root'));
}

run();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
