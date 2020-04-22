import React from 'react';

import { ThemeProvider } from '@material-ui/core';

import App from 'app/app';

import { customTheme } from 'app/theme';

interface RendererProps {
}

const Renderer: React.FC<RendererProps> = (props) => {
	return (
		<ThemeProvider theme={customTheme}>
			<App />
		</ThemeProvider>
	);
};

export default Renderer;
