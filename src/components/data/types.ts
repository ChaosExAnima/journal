import type { Dayjs } from 'dayjs';
import type { ContentState } from 'draft-js';
import type { LoadingState } from './constants';

export type APIQueryError = {
	error: string;
	message?: string;
	statusCode: number;
};

export type DataStoreEntry =
	| ContentState
	| APIQueryError
	| typeof LoadingState
	| undefined
	| null;
export type DataStoreEntries = Map< string, DataStoreEntry >;

export type DataStore = {
	hasError: boolean;
	loading: boolean;
	currentDate: Dayjs;
	entries: DataStoreEntries;
	currentDraft: ContentState | null;
};

export type DataStoreContext = DataStore & {
	loadEntry: ( date: Dayjs | Date ) => Promise< void >;
	updateEntry: ( entry: ContentState ) => void;
	saveDraft: () => void;
};
