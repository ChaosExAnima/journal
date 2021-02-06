import React, { lazy, useMemo } from 'react';
import {
	makeStyles,
	createStyles,
	Container,
	Box,
	ThemeProvider,
	createMuiTheme,
	useMediaQuery,
	CssBaseline,
} from '@material-ui/core';
import {
	BrowserRouter as Router,
	useHistory,
	useRouteMatch,
} from 'react-router-dom';
import { deepOrange } from '@material-ui/core/colors';
import { enableMapSet } from 'immer';

import EntryError from 'components/entry-editor/error';

const useStyles = makeStyles( ( theme ) =>
	createStyles( {
		root: {
			marginTop: theme.spacing( 4 ),
			display: 'flex',
			flexDirection: 'row',
			minHeight: `calc( 100vh - ${ theme.spacing( 4 ) }px )`,
		},
		main: {
			order: 1,
			flexGrow: 1,
			display: 'flex',
			flexDirection: 'column',
		},
		sidebar: {
			width: theme.breakpoints.values.sm / 3,
			marginRight: theme.spacing( 2 ),
			flexShrink: 0,
			top: theme.spacing( 4 ),
			bottom: 0,
		},
	} )
);

function FixPath() {
	const isValidPath = useRouteMatch( {
		path: [ '/', '/:year/:month/:day' ],
		exact: true,
	} );
	const { replace } = useHistory();
	if ( ! isValidPath ) {
		replace( '/' );
	}
	return null;
}

enableMapSet();

function App( props: object ) {
	const classes = useStyles( props );

	const prefersDarkMode = useMediaQuery( '(prefers-color-scheme: dark)' );
	const theme = useMemo(
		() =>
			createMuiTheme( {
				palette: {
					type: prefersDarkMode ? 'dark' : 'light',
					primary: deepOrange,
				},
			} ),
		[ prefersDarkMode ]
	);

	const DataLayer = lazy( () => import( 'components/data' ) );
	const EntryEditor = lazy( () => import( 'components/entry-editor' ) );
	const EntryHeader = lazy( () => import( 'components/entry-header' ) );
	const Sidebar = lazy( () => import( 'components/sidebar' ) );

	return (
		<ThemeProvider theme={ theme }>
			<DataLayer>
				<CssBaseline />
				<Router>
					<Container className={ classes.root }>
						<Box className={ classes.main } component="main">
							<EntryHeader />
							<Box my={ 2 } maxWidth="50%" flexGrow="1">
								<EntryError>
									<EntryEditor placeholder="What happened to you today?" />
								</EntryError>
							</Box>
						</Box>
						<Sidebar className={ classes.sidebar } />
						<FixPath />
					</Container>
				</Router>
			</DataLayer>
		</ThemeProvider>
	);
}

export default App;
