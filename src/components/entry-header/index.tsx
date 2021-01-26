import {
	Box,
	createStyles,
	IconButton,
	makeStyles,
	Typography,
} from '@material-ui/core';
import dayjs from 'dayjs';
import React from 'react';
import CheckIcon from '@material-ui/icons/Check';

type EntryHeaderProps = {
	currentDate: dayjs.Dayjs;
};

const useStyles = makeStyles( ( theme ) =>
	createStyles( {
		title: {
			marginRight: theme.spacing( 2 ),
		},
	} )
);

export default function EntryHeader( { currentDate }: EntryHeaderProps ) {
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
