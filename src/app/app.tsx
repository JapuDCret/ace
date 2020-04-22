import React from 'react';
import { Typography } from '@material-ui/core';
import FilterTable from './components/FilterTable';

interface AppProps {}

const App: React.FC<AppProps> = (props) => {
	return <FilterTable />;
};

export default App;
