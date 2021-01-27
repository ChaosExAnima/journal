import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import {
	makeStyles,
	createStyles,
	Container,
	Box,
	ThemeProvider,
	createMuiTheme,
	useMediaQuery,
	CssBaseline,
	Fab,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import SidebarDates from 'components/sidebar-dates';
import EntryHeader from 'components/entry-header';
import { deepOrange, pink } from '@material-ui/core/colors';
import EntryEditor from 'components/entry-editor';

const useStyles = makeStyles( ( theme ) =>
	createStyles( {
		root: {
			marginTop: theme.spacing( 4 ),
			display: 'flex',
			flexDirection: 'row',
		},
		main: {
			order: 1,
			flexGrow: 1,
		},
		sidebar: {
			order: 0,
			width: theme.breakpoints.values.sm / 3,
			marginRight: theme.spacing( 2 ),
			overflowY: 'auto',
		},
		newButton: {
			width: '100%',
		},
		newButtonIcon: {
			marginLeft: theme.spacing( 1 ),
		},
		newEntry: {
			display: 'flex',
			marginBottom: theme.spacing( 2 ),
			marginLeft: 'auto',
			marginRight: 'auto',
		},
	} )
);

function App( props: object ) {
	const classes = useStyles( props );

	const prefersDarkMode = useMediaQuery( '(prefers-color-scheme: dark)' );
	const theme = useMemo(
		() =>
			createMuiTheme( {
				palette: {
					type: prefersDarkMode ? 'dark' : 'light',
					primary: deepOrange,
					secondary: pink,
				},
			} ),
		[ prefersDarkMode ]
	);

	return (
		<ThemeProvider theme={ theme }>
			<CssBaseline />
			<Container className={ classes.root }>
				<Box className={ classes.main } component="main">
					<EntryHeader currentDate={ dayjs() } />
					<Box my={ 2 } maxWidth="50%">
						<EntryEditor
							className={ classes.newButton }
							placeholder="What happened to you today?"
						/>
					</Box>
				</Box>
				<Box className={ classes.sidebar } component="aside">
					<Fab
						color="primary"
						aria-label="add"
						className={ classes.newEntry }
						variant="extended"
					>
						Today
						<AddIcon className={ classes.newButtonIcon } />
					</Fab>
					<SidebarDates startDate={ dayjs() } />
				</Box>
			</Container>
		</ThemeProvider>
	);
}

export default App;
