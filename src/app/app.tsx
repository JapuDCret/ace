import React, { useState, useCallback } from 'react';
import { Switch, Route, Redirect, useHistory } from 'react-router-dom';

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
	Container,
} from '@material-ui/core';

import MenuIcon from '@material-ui/icons/Menu';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

import FishList from 'app/pages/FishList';
import CritterList from 'app/pages/CritterList';

interface AppConfig {
	useAmericanTimeFormat: boolean;
}

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
			},
		},
	},
	inputLabel: {
		color: `${grey[50]} !important`,
	},
});

interface AppProps {}

const App: React.FC<AppProps> = () => {
	const classes = useStyles();
	const [height, setHeight] = useState(0);
	const history = useHistory();

	const headerRef = useCallback((node) => {
		if (node !== null) {
			setHeight(node.getBoundingClientRect().height);
		}
	}, []);

	const { i18n } = useTranslation();

	const [menuOpen, setMenuOpen] = useState(false);

	const [useAmericanTimeFormat, setUseAmericanTimeFormat] = React.useState<boolean>(
		defaultConfig.useAmericanTimeFormat
	);

	const changePage = (path: '/' | '/fish-list' | '/critter-list'): void => {
		history.push(path);

		setMenuOpen(false);
	};

	return (
		<div>
			<ConfigContext.Provider value={{ useAmericanTimeFormat }}>
				<nav>
					<AppBar ref={headerRef} position="fixed">
						<Container maxWidth="lg">
							<Toolbar style={{ padding: '1rem 8px' }}>
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
													<MenuItem key={language} value={language}>
														{language}
													</MenuItem>
												);
											})}
										</TextField>
									</Grid>
								</Grid>
							</Toolbar>
						</Container>
					</AppBar>
					<SwipeableDrawer
						anchor={'left'}
						open={menuOpen}
						onClose={() => setMenuOpen(false)}
						onOpen={() => setMenuOpen(true)}
					>
						<List>
							<ListItem button key={'nav-to-start'} onClick={() => changePage('/')}>
								<ListItemIcon>
									<InboxIcon />
								</ListItemIcon>
								<ListItemText primary={'Start'} />
							</ListItem>

							<ListItem button key={'nav-to-fish-list'} onClick={() => changePage('/fish-list')}>
								<ListItemIcon>
									<MailIcon />
								</ListItemIcon>
								<ListItemText primary={'Fish List'} />
							</ListItem>
							<ListItem button key={'nav-to-critter-list'} onClick={() => changePage('/critter-list')}>
								<ListItemIcon>
									<MailIcon />
								</ListItemIcon>
								<ListItemText primary={'Critter List'} />
							</ListItem>
						</List>
					</SwipeableDrawer>
				</nav>
				<div
					id="content"
					style={{
						marginTop: `${height}px`,
					}}
				>
					<Box p={1}>
						<Container maxWidth="lg">
							<Switch>
								<Route path="/" exact>
									<p>Hello World</p>
								</Route>

								<Route path="/fish-list" component={FishList} />

								<Route path="/critter-list" component={CritterList} />

								<Route path="*">
									<Redirect to="/" />
								</Route>
							</Switch>
						</Container>
					</Box>
				</div>
			</ConfigContext.Provider>
		</div>
	);
};

export default App;
