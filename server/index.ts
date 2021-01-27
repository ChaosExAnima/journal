import fastify from 'fastify';
import { resolve } from 'path';
import { version } from '../package.json';

const server = fastify( { logger: true } );

// Plugins.
server.register( import( 'fastify-static' ), {
	root: resolve( __dirname, '..', 'build' ),
	wildcard: false,
} );
server.register( import( 'fastify-helmet' ), {
	contentSecurityPolicy: false,
} );
server.register( import( 'fastify-cors' ), {
	origin: process.env.HOSTNAME ?? true,
	methods: [ 'GET', 'POST' ],
} );

server.get( '/api', async () => ( {
	message: 'Things 💯 here!',
	version,
} ) );

// Serves journal entries.
server.get( '/api/entries', async () => [] );

// Saves a journal entry.
server.post( '/api/save', async () => ( { success: true } ) );

// Serves the built file for all other paths.
server.get( '*', async ( req, reply ) => {
	return reply.sendFile( 'index.html' );
} );

async function start() {
	const port: number = Number.parseInt( process.env.SERVER_PORT ?? '3002' );
	try {
		// eslint-disable-next-line no-console
		console.log( `Starting API server on port ${ port }!` );
		await server.listen( port );
	} catch ( err ) {
		server.log.error( err );
		process.exit( 1 );
	}
}

start();
