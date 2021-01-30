import React from 'react';
import {
	CircularProgress,
	createStyles,
	IconButton,
	List,
	ListItem,
	ListItemText,
	ListSubheader,
	makeStyles,
	Paper,
} from '@material-ui/core';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';

import { useApiEntries } from 'components/data';
import dayjs from 'dayjs';

type SidebarDatesProps = {
	onEntryClick: ( date: dayjs.Dayjs ) => void;
};

const useStyles = makeStyles( ( theme ) =>
	createStyles( {
		subheader: {
			display: 'flex',
			alignItems: 'center',
			backgroundColor: theme.palette.background.paper,
			borderRadius: 0,
			paddingRight: theme.spacing( 2 ) - 12,
		},
		loading: {
			textAlign: 'center',
			marginTop: theme.spacing( 2 ),
		},
	} )
);

export default function SidebarDates( { onEntryClick }: SidebarDatesProps ) {
	const { data: dates, loading } = useApiEntries();
	const classes = useStyles();

	if ( ! loading || ! Array.isArray( dates ) ) {
		return (
			<div className={ classes.loading }>
				<CircularProgress className={ classes.loading } />
			</div>
		);
	}
	if ( dates.length === 0 ) {
		return <p>No entries found!</p>;
	}

	return (
		<nav>
			<List
				subheader={
					<ListSubheader
						component={ Paper }
						className={ classes.subheader }
					>
						<ListItemText
							primary={ dates[ 0 ].format( 'MMMM YYYY' ) }
						/>
						<IconButton color="primary">
							<CalendarTodayIcon />
						</IconButton>
					</ListSubheader>
				}
			>
				{ dates.map( ( date ) => (
					<ListItem button key={ date.toString() }>
						<ListItemText
							primary={ date.format( 'MM/DD/YYYY' ) }
							onClick={ () => onEntryClick( date ) }
						/>
					</ListItem>
				) ) }
			</List>
		</nav>
	);
}
