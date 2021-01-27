import fastify from 'fastify';
import { resolve } from 'path';
import { version } from '../package.json';

const server = fastify( { logger: true } );

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

server.get( '/api/entries', async () => [] );

server.post( '/api/save', async () => ( { success: true } ) );

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
