import { Component, createContext, ReactNode, useContext } from 'react';
import { ContentState, convertFromRaw, RawDraftContentState } from 'draft-js';
import dayjs, { Dayjs } from 'dayjs';
import { OrderedMap as Map } from 'immutable';

import type { DataStore, DataStoreContext, DataStoreEntry } from './types';
import { fetchData } from './utils';

const APIDateFormat = 'YYYY-MM-DD';
export const LoadingState = Symbol( 'loading state' );

const defaultStore = (): DataStore => ( {
	hasError: false,
	loading: false,
	currentDate: dayjs(),
	entries: Map(),
} );

export const DataContext = createContext< DataStoreContext >( {
	...defaultStore(),
	loadEntry: () => Promise.resolve(),
} );

export default class DataLayer extends Component<
	{ children: ReactNode },
	DataStore
> {
	state: DataStore = defaultStore();

	loadedEntries = new Set< Dayjs >();

	constructor( props: { children: ReactNode } ) {
		super( props );
		this.loadEntries = this.loadEntries.bind( this );
		this.loadEntry = this.loadEntry.bind( this );
		this.updateEntry = this.updateEntry.bind( this );
	}

	componentDidMount() {
		this.loadEntries();
		this.loadEntry( this.state.currentDate );
	}

	async loadEntry( rawDate: Dayjs | Date ) {
		const date = dayjs( rawDate );
		const dateKey = date.format( APIDateFormat );
		if ( ! this.state.entries.has( dateKey ) ) {
			return;
		}
		this.setState( ( curStore ) => ( {
			...curStore,
			currentDate: date,
			entries: this.state.entries.set( dateKey, LoadingState ),
		} ) );
		if ( this.loadedEntries.has( date ) ) {
			return;
		}
		this.loadedEntries.add( date );
		const rawEntry = await fetchData< RawDraftContentState >(
			`entry?date=${ date.format( APIDateFormat ) }`
		);
		this.setState( ( curStore ) => ( {
			...curStore,
			entries: this.state.entries.set(
				date.format( APIDateFormat ),
				'error' in rawEntry ? rawEntry : convertFromRaw( rawEntry )
			),
		} ) );
	}

	async loadEntries() {
		if ( this.state.loading || this.state.entries.size ) {
			return;
		}
		this.setState( ( curState ) => ( { ...curState, loading: true } ) );
		const entryDates = await fetchData< string[] >( 'entries' );
		if ( 'error' in entryDates ) {
			return this.setState( ( curStore ) => ( {
				...curStore,
				loading: false,
				hasError: true,
			} ) );
		}
		const parsedEntryDates = entryDates
			.sort()
			.reverse()
			.map( ( date ) => [ date, null ] );

		this.setState( ( curStore ) => ( {
			...curStore,
			entries: Map( parsedEntryDates ),
			loading: false,
		} ) );
	}

	updateEntry( date: dayjs.Dayjs, entry: DataStoreEntry ) {
		this.setState( {
			...this.state,
			entries: this.state.entries.set(
				date.format( APIDateFormat ),
				entry
			),
		} );
	}

	render() {
		const contextValue = {
			...this.state,
			loadEntry: this.loadEntry,
			updateEntry: ( content: ContentState ) =>
				this.updateEntry( this.state.currentDate, content ),
			saveEntry: () => null,
			deleteEntry: () => null,
		};

		return (
			<DataContext.Provider value={ contextValue }>
				{ this.props.children }
			</DataContext.Provider>
		);
	}
}

export function useStore(): DataStoreContext {
	const store = useContext( DataContext );
	if ( ! store ) {
		throw Error( 'Store is null' );
	}
	return store;
}

export function useCurrentEntry(): DataStoreEntry {
	const store = useContext( DataContext );
	if ( ! store ) {
		return null;
	}
	return store.entries.get( store.currentDate.format( APIDateFormat ) );
}
