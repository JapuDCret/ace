import { createMuiTheme, responsiveFontSizes } from '@material-ui/core';
import createPalette from '@material-ui/core/styles/createPalette';
import createTypography from '@material-ui/core/styles/createTypography';
import createSpacing from '@material-ui/core/styles/createSpacing';

const customPalette = createPalette({
    primary: {
        main: '#3f51b5',
    },
    secondary: {
        main: '#f50057',
    },
    error: {
        main: '#f44336',
    },
    warning: {
        main: '#ff9800',
    },
    info: {
        main: '#2196f3',
    },
    success: {
        main: '#4caf50',
    },
    text: {
        primary: 'rgba(0, 0, 0, 0.87)',
        secondary: 'rgba(0, 0, 0, 0.54)',
        disabled: 'rgba(0, 0, 0, 0.38)',
        hint: 'rgba(0, 0, 0, 0.38)',
    },
    divider: 'rgba(0, 0, 0, 0.12)'
});

const customTypography = createTypography(customPalette, {
    fontFamily: 'FiraSans-Medium',
});

const customThemeNonResponsive = createMuiTheme({
    palette: customPalette,
    typography: customTypography,
    spacing: createSpacing(8),
});

export const customTheme = responsiveFontSizes(customThemeNonResponsive);