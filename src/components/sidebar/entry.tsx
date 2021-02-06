import React from 'react';
import { ListItem, ListItemText } from '@material-ui/core';

import { useStore } from 'components/data/hooks';

import type { Dayjs } from 'dayjs';

export default function SidebarEntry( { date }: { date?: Dayjs } ) {
	const { currentDate, loadEntry } = useStore();
	if ( ! date ) {
		return null;
	}
	return (
		<ListItem
			button
			key={ date.toString() }
			selected={ date.isSame( currentDate, 'day' ) }
			component="li"
		>
			<ListItemText
				primary={ date.format( 'M/D' ) }
				onClick={ () => loadEntry( date ) }
			/>
		</ListItem>
	);
}
