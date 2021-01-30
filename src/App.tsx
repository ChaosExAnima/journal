import React, { useMemo, useState } from 'react';
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
import { deepOrange, pink } from '@material-ui/core/colors';
import AddIcon from '@material-ui/icons/Add';

import SidebarDates from 'components/sidebar-dates';
import EntryHeader from 'components/entry-header';
import EntryEditor from 'components/entry-editor';
import EntryError from 'components/entry-editor/error';
import DataLayer from 'components/data';

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
			flexShrink: 0,
		},
		newEntryButton: {
			display: 'flex',
			marginBottom: theme.spacing( 2 ),
			marginLeft: 'auto',
			marginRight: 'auto',
		},
		newEntryButtonIcon: {
			marginLeft: theme.spacing( 1 ),
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

	const [ appState, setAppState ] = useState( {
		currentDate: dayjs(),
		errorFound: false,
	} );

	const onError = () => {
		setAppState( {
			...appState,
			errorFound: true,
		} );
	};

	return (
		<ThemeProvider theme={ theme }>
			<DataLayer>
				<CssBaseline />
				<Container className={ classes.root }>
					<Box className={ classes.main } component="main">
						<EntryHeader currentDate={ appState.currentDate } />
						<Box my={ 2 } maxWidth="50%">
							<EntryError onError={ onError }>
								<EntryEditor placeholder="What happened to you today?" />
							</EntryError>
						</Box>
					</Box>
					<Box className={ classes.sidebar } component="aside">
						<Fab
							color="primary"
							aria-label="add"
							className={ classes.newEntryButton }
							variant="extended"
						>
							Today
							<AddIcon className={ classes.newEntryButtonIcon } />
						</Fab>
						<SidebarDates />
					</Box>
				</Container>
			</DataLayer>
		</ThemeProvider>
	);
}

export default App;
