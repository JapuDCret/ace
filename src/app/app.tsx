import React, { useState } from 'react';

import { AppBar, Toolbar, IconButton, Typography, SwipeableDrawer, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';

import MenuIcon from '@material-ui/icons/Menu';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

import FishList from 'app/pages/fish-list';

interface AppProps {
}

const App: React.FC<AppProps> = (props) => {
	const [ menuOpen, setMenuOpen ] = useState(false);

	return (
		<div>
			<nav>
				<AppBar position="static">
					<Toolbar>
						<IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setMenuOpen(!menuOpen)}>
							<MenuIcon />
						</IconButton>
						<Typography variant="h6">
							ACE
						</Typography>
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
							<ListItemIcon><InboxIcon /></ListItemIcon>
							<ListItemText primary={'Navigation Item#1'} />
						</ListItem>
						<ListItem button key={'nav-item-002'}>
							<ListItemIcon><MailIcon /></ListItemIcon>
							<ListItemText primary={'Navigation Item#2'} />
						</ListItem>
					</List>
				</SwipeableDrawer>
			</nav>
			<div id="content">
				<FishList />
			</div>
		</div>
	);
};

export default App;
