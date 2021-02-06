import { Dayjs } from 'dayjs';
import { useContext } from 'react';
import { APIDateFormat, DataContext } from './constants';
import type { DataStoreContext, DataStoreEntry } from './types';

export function useStore(): DataStoreContext {
	const store = useContext( DataContext );
	if ( ! store ) {
		throw new Error( 'Using store outside of data provider' );
	}
	return store;
}

export function useCurrentDate(): Dayjs {
	const { currentDate } = useStore();
	return currentDate;
}

export function useCurrentEntry(): DataStoreEntry {
	const store = useStore();
	return store.entries.get( store.currentDate.format( APIDateFormat ) );
}
