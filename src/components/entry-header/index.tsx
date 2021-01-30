import {
	Box,
	createStyles,
	IconButton,
	makeStyles,
	Typography,
} from '@material-ui/core';
import React from 'react';
import CheckIcon from '@material-ui/icons/Check';

import { useStore } from 'components/data';

const useStyles = makeStyles( ( theme ) =>
	createStyles( {
		title: {
			marginRight: theme.spacing( 2 ),
		},
	} )
);

export default function EntryHeader() {
	const { currentDate } = useStore();
	const classes = useStyles();
	return (
		<Box component="header" display="flex" alignItems="center">
			<Typography variant="h2" component="h1" className={ classes.title }>
				{ currentDate.format( 'MMMM D, YYYY' ) }
			</Typography>
			<IconButton>
				<CheckIcon color="disabled" />
			</IconButton>
		</Box>
	);
}
