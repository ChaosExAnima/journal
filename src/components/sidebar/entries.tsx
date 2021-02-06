import React, { ReactNode } from 'react';
import {
	Box,
	createStyles,
	List,
	ListItemText,
	ListSubheader,
	makeStyles,
} from '@material-ui/core';
import dayjs from 'dayjs';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import memoize from 'lodash/memoize';

import SidebarEntry from './entry';
import { useStore } from 'components/data/hooks';
import Loading from 'components/loading';

const useStyles = makeStyles( ( theme ) =>
	createStyles( {
		root: {
			position: 'absolute',
			overflowY: 'scroll',
			top: 0,
			bottom: 0,
			left: 0,
			right: 0,
			paddingTop: 0,
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
			boxShadow: theme.shadows[ 3 ],
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

	const toDayjs = memoize( ( date: string ) => dayjs( date ) );
	const headerDateFormat = 'MMMM YYYY';
	const sortedEntries = Array.from( entries.keys() )
		.filter( Boolean )
		.sort()
		.reverse();
	const sortedMonths: ReactNode[] = map(
		groupBy( sortedEntries, ( value ) =>
			dayjs( value ).set( 'date', 1 ).format( headerDateFormat )
		),
		( monthEntries, month ) =>
			month && (
				<li
					key={ toDayjs( month ).unix() || 'unknown' }
					className={ classes.months }
				>
					<ol className={ classes.list }>
						{ month && (
							<ListSubheader className={ classes.subheader }>
								<ListItemText
									primary={ toDayjs( month ).format(
										headerDateFormat
									) }
								/>
							</ListSubheader>
						) }
						{ monthEntries?.map( ( entry ) => {
							if ( ! entry ) return null;
							const entryDate = dayjs( entry );
							return (
								<SidebarEntry
									key={ entryDate.unix() }
									date={ entryDate }
								/>
							);
						} ) }
					</ol>
				</li>
			)
	);

	return (
		<Box position="relative" height="100%" component="nav">
			<List component="ol" className={ classes.root }>
				{ sortedMonths }
			</List>
		</Box>
	);
}
