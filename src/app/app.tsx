import React, { useState } from 'react';

import { useTranslation } from 'react-i18next';

import grey from '@material-ui/core/colors/grey';
import {
	makeStyles,
	AppBar,
	Toolbar,
	IconButton,
	Typography,
	SwipeableDrawer,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Grid,
	TextField,
	MenuItem,
	Box,
} from '@material-ui/core';

import MenuIcon from '@material-ui/icons/Menu';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

import FishList from 'app/pages/fish-list';

interface AppConfig {
    useAmericanTimeFormat: boolean;
};

const defaultConfig: AppConfig = {
    useAmericanTimeFormat: false,
};

export const ConfigContext = React.createContext<AppConfig>(defaultConfig);

const useStyles = makeStyles({
	input: {
		color: `${grey[50]} !important`,

		'& > fieldset': {
			borderColor: `${grey[50]} !important`,

			'&:hover': {
				borderColor: `${grey[500]} !important`,
			}
		},
	},
	inputLabel: {
		color: `${grey[50]} !important`,
	},
  });

interface AppProps {}

const App: React.FC<AppProps> = (props) => {
	const classes = useStyles();

	const { t, i18n } = useTranslation();
	
	const [menuOpen, setMenuOpen] = useState(false);
	
    const [ useAmericanTimeFormat, setUseAmericanTimeFormat ] = React.useState<boolean>(defaultConfig.useAmericanTimeFormat);

	return (
		<div>
			<ConfigContext.Provider value={{ useAmericanTimeFormat }}>
				<nav>
					<AppBar position="static">
						<Toolbar>
							<Grid container justify="space-between" alignItems="center">
								<Grid container item xs={4} alignItems="center">
									<IconButton
										edge="start"
										color="inherit"
										aria-label="menu"
										onClick={() => setMenuOpen(!menuOpen)}
									>
										<MenuIcon />
									</IconButton>
									<Typography variant="h6">ACE</Typography>
								</Grid>
								<Grid item>
									<TextField
										id="language-select"
										label="Language"
										select
										variant="outlined"
										InputProps={{
											className: classes.input,
										}}
										InputLabelProps={{
											className: classes.inputLabel,
										}}
										value={i18n.language}
										onChange={(e) => i18n.changeLanguage(e.target.value)}
									>
										{i18n.languages.map((language) => {
											return (
											<MenuItem key={language} value={language}>{language}</MenuItem>
											);
										})}
									</TextField>
								</Grid>
							</Grid>
						</Toolbar>
					</AppBar>
					<SwipeableDrawer
						anchor={'left'}
						open={menuOpen}
						onClose={() => setMenuOpen(false)}
						onOpen={() => setMenuOpen(true)}
					>
						<List>
							<ListItem button key={'nav-item-001'}>
								<ListItemIcon>
									<InboxIcon />
								</ListItemIcon>
								<ListItemText primary={'Navigation Item#1'} />
							</ListItem>
							<ListItem button key={'nav-item-002'}>
								<ListItemIcon>
									<MailIcon />
								</ListItemIcon>
								<ListItemText primary={'Navigation Item#2'} />
							</ListItem>
						</List>
					</SwipeableDrawer>
				</nav>
				<div id="content">
					<Box p={1}>
						<FishList />
					</Box>
				</div>
			</ConfigContext.Provider>
		</div>
	);
};

export default App;
