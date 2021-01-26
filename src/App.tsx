import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import {
	makeStyles,
	createStyles,
	Container,
	Button,
	Box,
	ThemeProvider,
	createMuiTheme,
	useMediaQuery,
	CssBaseline,
} from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import SidebarDates from 'components/sidebar-dates';
import EntryHeader from 'components/entry-header';
import { deepOrange, pink } from '@material-ui/core/colors';

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
			// backgroundColor: theme.palette.background.default,
		},
		newEntry: {
			marginBottom: theme.spacing( 2 ),
			display: 'flex',
			alignItems: 'center',
			flexDirection: 'column',
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
					<Box component="article" my={ 2 }>
						Your editable journal entry here.
					</Box>
				</Box>
				<Box className={ classes.sidebar } component="aside">
					<Box className={ classes.newEntry }>
						<Button
							color="primary"
							variant="contained"
							endIcon={ <AddCircleIcon /> }
						>
							Today
						</Button>
					</Box>
					<SidebarDates startDate={ dayjs() } />
				</Box>
			</Container>
		</ThemeProvider>
	);
}

export default App;
