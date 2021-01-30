import React from 'react';
import {
	createStyles,
	List,
	ListItemText,
	ListSubheader,
	makeStyles,
} from '@material-ui/core';
import dayjs from 'dayjs';

import { useStore } from 'components/data';
import SidebarEntry from './entry';
import Loading from 'components/loading';

const useStyles = makeStyles( ( theme ) =>
	createStyles( {
		root: {
			position: 'relative',
			overflow: 'auto',
			maxHeight: '100vh',
		},
		list: {
			padding: 0,
		},
		months: {
			listStyle: 'none',
		},
		subheader: {
			display: 'flex',
			alignItems: 'center',
			backgroundColor: theme.palette.background.paper,
			borderRadius: 0,
			paddingRight: theme.spacing( 2 ) - 12,
		},
	} )
);

export default function SidebarEntries() {
	const { loading, entries } = useStore();
	const classes = useStyles();

	if ( loading ) {
		return <Loading />;
	}
	if ( entries.size === 0 ) {
		return <p>No entries found!</p>;
	}

	const headerDateFormat = 'MMMM YYYY';
	const sortedMonths = entries
		.keySeq()
		.filter( Boolean )
		.sort()
		.reverse()
		.groupBy( ( value ) => {
			return !! value && dayjs( value ).set( 'date', 1 );
		} )
		.map(
			( monthEntries, month ) =>
				month && (
					<li
						key={ dayjs( month ).unix() || 'unknown' }
						className={ classes.months }
					>
						{ month && (
							<ListSubheader className={ classes.subheader }>
								<ListItemText
									primary={ month.format( headerDateFormat ) }
								/>
							</ListSubheader>
						) }
						{ monthEntries
							?.map( ( entry ) => {
								if ( ! entry ) return null;
								const entryDate = dayjs( entry );
								return (
									<SidebarEntry
										key={ entryDate.unix() }
										date={ entryDate }
									/>
								);
							} )
							.valueSeq()
							.toArray() }
					</li>
				)
		)
		.valueSeq()
		.toArray();

	return <List subheader={ <li /> }>{ sortedMonths }</List>;
}
