import { resolve } from 'path';
import { promises as fs } from 'fs';
import dayjs from 'dayjs';
import { get } from 'https';

function getText(): Promise< string > {
	return new Promise( ( res, rej ) => {
		const request = get( 'https://litipsum.com/api', ( response ) => {
			if ( response.statusCode !== 200 ) {
				return rej(
					new Error( `Got status code: ${ response.statusCode }` )
				);
			}
			const text: string[] = [];
			response.on( 'data', ( chunk ) => text.push( chunk ) );
			response.on( 'end', () => res( text.join( '' ) ) );
		} );
		request.on( 'error', ( error ) => rej( error ) );
	} );
}

async function generate( toCreate = 100 ) {
	const today = dayjs().subtract( 1, 'day' );
	const entriesDir = resolve( __dirname, '..', 'entries' );
	const entries = ( await fs.readdir( entriesDir ) )
		.filter( ( file ) => file.endsWith( '.md' ) )
		.map( ( file ) => file.replace( '.md', '' ) );

	for ( let index = 0; index < toCreate; index++ ) {
		const entryDate = today
			.clone()
			.subtract( index, 'days' )
			.format( 'YYYY-MM-DD' );

		if ( entries.includes( entryDate ) ) {
			continue;
		}

		const entryText = await getText();

		await fs.writeFile( `${ entriesDir }/${ entryDate }.md`, entryText, {
			encoding: 'utf8',
		} );
	}
}

generate();
