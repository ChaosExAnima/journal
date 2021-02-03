import type { APIQueryError } from './types';

export async function fetchData< T >(
	path: string
): Promise< T | APIQueryError > {
	try {
		const response = await fetch( `http://localhost:3002/api/${ path }` );
		return response.json();
	} catch ( error ) {
		return error;
	}
}

export async function saveData( path: string, data: any ) {
	try {
		const response = await fetch( `http://localhost:3002/api/${ path }`, {
			method: 'POST',
			body: JSON.stringify( data ),
			headers: {
				'Content-Type': 'application/json',
			},
		} );
		return response.json();
	} catch ( error ) {
		return error;
	}
}
