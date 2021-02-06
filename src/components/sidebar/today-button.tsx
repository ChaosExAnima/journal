import { createStyles, Fab, makeStyles } from '@material-ui/core';
import { useStore } from 'components/data/hooks';
import React from 'react';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles( ( theme ) =>
	createStyles( {
		button: {
			display: 'flex',
			marginBottom: theme.spacing( 2 ),
			marginLeft: 'auto',
			marginRight: 'auto',
		},
		icon: {
			marginLeft: theme.spacing( 1 ),
		},
	} )
);

export default function SidebarTodayButton() {
	const classes = useStyles();
	const { loadEntry } = useStore();
	return (
		<Fab
			color="primary"
			aria-label="add"
			className={ classes.button }
			variant="extended"
			onClick={ () => loadEntry( new Date() ) }
		>
			Today
			<AddIcon className={ classes.icon } />
		</Fab>
	);
}
