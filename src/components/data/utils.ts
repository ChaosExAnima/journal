import type { APIQueryError } from './types';

export async function fetchData< T >(
	path: string
): Promise< T | APIQueryError > {
	try {
		const response = await fetch( `http://localhost:3002/api/${ path }` );
		return await response.json();
	} catch ( error ) {
		return error;
	}
}
