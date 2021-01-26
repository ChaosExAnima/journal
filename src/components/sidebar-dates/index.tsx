import React from 'react';
import dayjs from 'dayjs';
import {
	createStyles,
	IconButton,
	List,
	ListItem,
	// ListItemIcon,
	ListItemText,
	ListSubheader,
	makeStyles,
	Paper,
} from '@material-ui/core';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';

type SidebarDatesProps = {
	startDate: dayjs.Dayjs;
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

export default function SidebarDates( { startDate }: SidebarDatesProps ) {
	const classes = useStyles();
	return (
		<nav>
			<List
				subheader={
					<ListSubheader
						component={ Paper }
						className={ classes.subheader }
					>
						<ListItemText primary="Entries" />
						<IconButton color="primary">
							<CalendarTodayIcon />
						</IconButton>
					</ListSubheader>
				}
			>
				{ Array.from( Array( 10 ).keys() ).map( ( daysFromToday ) => (
					<ListItem button key={ daysFromToday }>
						<ListItemText
							primary={ startDate
								.clone()
								.subtract( daysFromToday - 1, 'day' )
								.format( 'MM/DD/YYYY' ) }
						/>
					</ListItem>
				) ) }
			</List>
		</nav>
	);
}
