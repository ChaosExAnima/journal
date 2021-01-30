import type { Dayjs } from 'dayjs';
import type { ContentState } from 'draft-js';
import type { Map } from 'immutable';

export type APIQueryError = {
	error: string;
	message?: string;
	statusCode: number;
};

export type DataStoreEntry = ContentState | APIQueryError | undefined | null;
export type DataStoreEntries = Map< Dayjs, DataStoreEntry >;

export type DataStore = {
	hasError: boolean;
	loading: boolean;
	currentDate: Dayjs;
	entries: DataStoreEntries;
};

export type DataStoreContext = DataStore & {
	loadEntry: ( date: Dayjs | Date ) => Promise< void >;
};
