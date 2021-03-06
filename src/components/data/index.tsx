import { Component, ReactNode } from 'react';
import {
	ContentState,
	convertFromRaw,
	convertToRaw,
	RawDraftContentState,
} from 'draft-js';
import dayjs, { Dayjs } from 'dayjs';
import produce from 'immer';
import debounce from 'lodash/debounce';

import { fetchData, saveData } from './utils';
import { APIDateFormat, DataContext, LoadingState } from './constants';

import type { DataStore } from './types';

export default class DataLayer extends Component<
	{ children: ReactNode },
	DataStore
> {
	state: DataStore = {
		hasError: false,
		loading: false,
		currentDate: dayjs(),
		entries: new Map(),
		currentDraft: null,
	};

	loadedEntries = new Set< Dayjs >();

	constructor( props: { children: ReactNode } ) {
		super( props );
		this.loadEntries = this.loadEntries.bind( this );
		this.loadEntry = this.loadEntry.bind( this );
		// @ts-ignore
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
			this.saveDraft( this.state.currentDate );
		}

		// If it doesn't exist, switch to it and exit.
		if (
			! this.state.entries.has( dateKey ) &&
			! this.state.currentDate.isSame( date, 'day' )
		) {
			return this.setState(
				produce( ( newState: DataStore ) => {
					newState.currentDate = date;
				} )
			);
		}

		// Set entry to loading.
		this.setState(
			produce( ( newState: DataStore ) => {
				newState.currentDate = date;
				newState.entries.set( dateKey, LoadingState );
			} )
		);

		// Ensure we don't load this multiple times.
		if ( this.loadedEntries.has( date ) ) {
			return;
		}
		this.loadedEntries.add( date );

		// Load and set the state based on error or success.
		const rawEntry = await fetchData< RawDraftContentState >(
			`entry?date=${ date.format( APIDateFormat ) }`
		);
		this.setState(
			produce( ( newStore: DataStore ) => {
				newStore.entries = newStore.entries.set(
					date.format( APIDateFormat ),
					'error' in rawEntry ? rawEntry : convertFromRaw( rawEntry )
				);
			} )
		);
	}

	async loadEntries() {
		if ( this.state.loading || this.state.entries.size ) {
			return;
		}
		this.setState(
			produce( ( newStore: DataStore ) => {
				newStore.loading = true;
			} )
		);
		const entryDates = await fetchData< string[] >( 'entries' );
		if ( 'error' in entryDates ) {
			return this.setState(
				produce( ( newStore: DataStore ) => {
					newStore.loading = false;
					newStore.hasError = true;
				} )
			);
		}
		const parsedEntryDates: [ string, null ][] = entryDates
			.sort()
			.reverse()
			.map( ( date ) => [ date, null ] );

		this.setState(
			produce( ( newStore: DataStore ) => {
				newStore.entries = new Map( parsedEntryDates );
				newStore.loading = false;
			} )
		);
	}

	async updateEntry( date: Dayjs, entry: ContentState ) {
		const { currentDraft, entries } = this.state;
		if ( currentDraft && entry === currentDraft ) {
			return;
		}

		const dateKey = date.format( APIDateFormat );
		if ( ! entries.has( dateKey ) && entry.hasText() ) {
			this.setState(
				produce( ( newStore: DataStore ) => {
					newStore.entries = newStore.entries.set( dateKey, null );
				} )
			);
		}

		if ( entry.hasText() ) {
			await saveData(
				`entry?date=${ date.format( APIDateFormat ) }`,
				convertToRaw( entry )
			);
		}
		this.setState(
			produce( ( newStore: DataStore ) => {
				newStore.currentDraft = entry;
			} )
		);
	}

	saveDraft( date: Dayjs ) {
		this.setState(
			produce( ( newStore: DataStore ) => {
				newStore.currentDraft = null;
				newStore.entries = newStore.entries.set(
					date.format( APIDateFormat ),
					this.state.currentDraft
				);
			} )
		);
	}

	render() {
		const contextValue = {
			...this.state,
			loadEntry: this.loadEntry,
			updateEntry: ( content: ContentState ) =>
				this.updateEntry( this.state.currentDate, content ),
			saveDraft: () => this.saveDraft( this.state.currentDate ),
			deleteEntry: () => null,
		};

		return (
			<DataContext.Provider value={ contextValue }>
				{ this.props.children }
			</DataContext.Provider>
		);
	}
}
