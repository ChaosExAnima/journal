import {
	Box,
	createStyles,
	IconButton,
	makeStyles,
	Typography,
} from '@material-ui/core';
import React from 'react';
import SaveIcon from '@material-ui/icons/Save';

import { useStore } from 'components/data/hooks';

const useStyles = makeStyles( ( theme ) =>
	createStyles( {
		title: {
			marginRight: theme.spacing( 2 ),
		},
	} )
);

export default function EntryHeader() {
	const { currentDate, currentDraft, saveDraft } = useStore();
	const classes = useStyles();

	return (
		<Box component="header" display="flex" alignItems="center">
			<Typography variant="h2" component="h1" className={ classes.title }>
				{ currentDate.format( 'MMMM D, YYYY' ) }
			</Typography>
			<IconButton onClick={ saveDraft } disabled={ ! currentDraft }>
				<SaveIcon color="disabled" />
			</IconButton>
		</Box>
	);
}
