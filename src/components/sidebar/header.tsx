import React from 'react';
import { IconButton, ListItemText, ListSubheader } from '@material-ui/core';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';

import { useStore } from 'components/data/hooks';

type EntryHeaderProps = {
	monthString?: string;
	className?: string;
};

export default function SidebarEntryHeader( {
	monthString,
	className,
}: EntryHeaderProps ) {
	const { loadEntry, currentDate } = useStore();
	if ( ! monthString ) {
		return null;
	}
	return (
		<ListSubheader className={ className }>
			<ListItemText primary={ monthString } />
			<IconButton
				color="primary"
				onClick={ () => loadEntry( new Date() ) }
				disabled={ currentDate.isSame( new Date(), 'day' ) }
			>
				<CalendarTodayIcon />
			</IconButton>
		</ListSubheader>
	);
}
