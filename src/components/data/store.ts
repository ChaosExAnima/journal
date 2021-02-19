import { ContentState } from 'draft-js';
// import { makeAutoObservable } from 'mobx';

class EntryStore {
	entries: Map< string, ContentState > = new Map();

	constructor() {
		// makeAutoObservable( this );
	}

	getEntries() {
		return this.entries;
	}
}

export default class JournalStore {
	constructor() {
		// makeAutoObservable( this );
	}
}
