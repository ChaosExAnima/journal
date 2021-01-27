import dayjs from 'dayjs';
import { ContentState, convertFromRaw, RawDraftContentState } from 'draft-js';
import { useEffect, useState } from 'react';

const APIDateFormat = 'YYYY-MM-DD';

type APIQueryResponse< R > = {
	loading: boolean;
	data?: R;
};

export function useApiQuery< R >( path: string ): APIQueryResponse< R > {
	const [ loading, setLoading ] = useState( true );
	const [ data, setData ] = useState< R >();

	useEffect( () => {
		if ( ! path ) {
			return;
		}
		const fetchData = async () => {
			try {
				const response = await fetch(
					`http://localhost:3002/api/${ path }`
				);
				const parsed: R = await response.json();
				setData( parsed );
				setLoading( false );
			} catch ( err ) {
				setLoading( false );
			}
		};
		fetchData();
	}, [ path ] );

	return { loading, data };
}

export function useApiEntries(): dayjs.Dayjs[] | undefined {
	const { data } = useApiQuery< string[] >( 'entries' );
	if ( ! data ) {
		return undefined;
	}
	return data.map( dayjs );
}

export function useApiEntry(
	date: dayjs.Dayjs
): APIQueryResponse< ContentState > {
	const { loading, data: rawEntry } = useApiQuery< RawDraftContentState >(
		`entry?date=${ date.format( APIDateFormat ) }`
	);
	if ( ! rawEntry ) {
		return { loading };
	}
	return { data: convertFromRaw( rawEntry ), loading };
}
