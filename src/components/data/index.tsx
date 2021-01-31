import { Component, createContext, ReactNode, useContext } from 'react';
import {
	ContentState,
	convertFromRaw,
	convertToRaw,
	RawDraftContentState,
} from 'draft-js';
import dayjs, { Dayjs } from 'dayjs';
import { OrderedMap as Map } from 'immutable';
import { debounce } from 'ts-debounce';

import type { DataStore, DataStoreContext, DataStoreEntry } from './types';
import { fetchData, saveData } from './utils';

const APIDateFormat = 'YYYY-MM-DD';
export const LoadingState = Symbol( 'loading state' );

const defaultStore = (): DataStore => ( {
	hasError: false,
	loading: false,
	currentDate: dayjs(),
	entries: Map(),
	currentDraft: null,
} );

export const DataContext = createContext< DataStoreContext >( {
	...defaultStore(),
	loadEntry: () => Promise.resolve(),
	updateEntry: () => null,
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
		this.updateEntry = debounce( this.updateEntry.bind( this ), 200 );
		this.saveDraft = this.saveDraft.bind( this );
	}

	componentDidMount() {
		this.loadEntries();
		this.loadEntry( this.state.currentDate );
	}

	async loadEntry( rawDate: Dayjs | Date ) {
		const date = dayjs( rawDate );
		const dateKey = date.format( APIDateFormat );

		// First save the draft before switching.
		if ( this.state.currentDraft ) {
			this.saveDraft( this.state.currentDate, this.state.currentDraft );
		}

		// If it doesn't exist, switch to it and exit.
		if ( ! this.state.entries.has( dateKey ) ) {
			this.setState( {
				...this.state,
				currentDate: date,
			} );
			return;
		}

		// Set entry to loading.
		this.setState( {
			...this.state,
			currentDate: date,
			entries: this.state.entries.set( dateKey, LoadingState ),
		} );

		// Ensure we don't load this multiple times.
		if ( this.loadedEntries.has( date ) ) {
			return;
		}
		this.loadedEntries.add( date );

		// Load and set the state based on error or success.
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

	updateEntry( date: Dayjs, entry: ContentState ) {
		if ( this.state.currentDraft && entry === this.state.currentDraft ) {
			return;
		}
		saveData(
			`entry?date=${ date.format( APIDateFormat ) }`,
			convertToRaw( entry )
		).then( () => {
			this.setState( {
				...this.state,
				currentDraft: entry,
			} );
		} );
	}

	saveDraft( date: Dayjs, entry: ContentState ) {
		this.setState( {
			...this.state,
			entries: this.state.entries.set(
				date.format( APIDateFormat ),
				entry
			),
			currentDraft: null,
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
