import React from 'react';
import {
	CircularProgress,
	createStyles,
	List,
	makeStyles,
} from '@material-ui/core';

import { useStore } from 'components/data';
import SidebarEntryHeader from './header';
import SidebarEntry from './entry';

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

export default function SidebarDates() {
	const { loading, entries } = useStore();
	const classes = useStyles();

	if ( loading ) {
		return (
			<div className={ classes.loading }>
				<CircularProgress className={ classes.loading } />
			</div>
		);
	}
	if ( entries.size === 0 ) {
		return <p>No entries found!</p>;
	}

	const headerDateFormat = 'MMMM YYYY';
	const sortedMonths = entries.groupBy( ( value, key ) => {
		return key?.format( headerDateFormat );
	} );

	return (
		<List component="nav">
			<ul>
				{ sortedMonths
					.map( ( monthEntries, monthString ) => (
						<li key={ monthString }>
							<SidebarEntryHeader
								monthString={ monthString }
								key={ monthString }
							/>
							{ monthEntries &&
								monthEntries
									.map(
										( _entry, date ) =>
											date && (
												<SidebarEntry
													key={ date.toString() }
													date={ date }
												/>
											)
									)
									.toArray() }
						</li>
					) )
					.toArray() }
			</ul>
		</List>
	);
}
