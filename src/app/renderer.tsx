import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { I18nextProvider } from 'react-i18next';

import { ThemeProvider } from '@material-ui/core';

import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

import { customTheme } from 'app/theme';
import i18n from 'app/i18n';
import App from 'app/app';
import DataProvider from 'app/providers/DataProvider';

interface RendererProps {
	basePath: string;
}

const Renderer: React.FC<RendererProps> = (props) => {
	i18n.changeLanguage(navigator.language);

	return (
		<ThemeProvider theme={customTheme}>
			<I18nextProvider i18n={i18n}>
				<MuiPickersUtilsProvider utils={DateFnsUtils}>
					<DataProvider>
						<Router basename={props.basePath}>
							<App />
						</Router>
					</DataProvider>
				</MuiPickersUtilsProvider>
			</I18nextProvider>
		</ThemeProvider>
	);
};

export default Renderer;
