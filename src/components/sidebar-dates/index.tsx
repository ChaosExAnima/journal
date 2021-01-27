import React from 'react';
import dayjs from 'dayjs';
import {
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

type SidebarDatesProps = {
	dates?: dayjs.Dayjs[];
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
	} )
);

export default function SidebarDates( { dates }: SidebarDatesProps ) {
	const classes = useStyles();

	if ( ! dates ) {
		return null;
	}
	if ( dates.length === 0 ) {
		return null;
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
						<ListItemText primary={ date.format( 'MM/DD/YYYY' ) } />
					</ListItem>
				) ) }
			</List>
		</nav>
	);
}
