import React, { useMemo } from 'react';
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
import { deepOrange, pink } from '@material-ui/core/colors';

import EntryHeader from 'components/entry-header';
import EntryEditor from 'components/entry-editor';
import EntryError from 'components/entry-editor/error';
import DataLayer from 'components/data';
import Sidebar from 'components/sidebar';

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
			<DataLayer>
				<CssBaseline />
				<Container className={ classes.root }>
					<Box className={ classes.main } component="main">
						<EntryHeader />
						<Box my={ 2 } maxWidth="50%">
							<EntryError>
								<EntryEditor placeholder="What happened to you today?" />
							</EntryError>
						</Box>
					</Box>
					<Sidebar className={ classes.sidebar } />
				</Container>
			</DataLayer>
		</ThemeProvider>
	);
}

export default App;
