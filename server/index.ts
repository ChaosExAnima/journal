import fastify from 'fastify';
import { resolve } from 'path';
import { promises as fs } from 'fs';
import { draftjsToMd, mdToDraftjs } from 'draftjs-md-converter';
import { RawDraftContentState } from 'draft-js';

import { version } from '../package.json';

const server = fastify( { logger: true } );

const entriesDir = resolve( __dirname, '..', 'entries' );
const staticDir = resolve( __dirname, '..', 'build' );

// Plugins.
server.register( import( 'fastify-static' ), {
	root: staticDir,
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
server.get( '/api/entries', async ( req, reply ) => {
	const entries = ( await fs.readdir( entriesDir ) )
		.filter( ( file ) => file.endsWith( '.md' ) )
		.map( ( file ) => file.replace( '.md', '' ) );
	reply.send( entries );
} );

type GetEntry = {
	Querystring: {
		date?: string;
	};
};

type PostEntry = {
	Body?: RawDraftContentState;
};

// Serve entry in format that Draft.js can understand.
server.get< GetEntry >( '/api/entry', async ( req, reply ) => {
	const { date } = req.query;
	if ( ! date ) {
		return reply
			.code( 400 )
			.send( new Error( 'Please provide an entry date' ) );
	}

	if ( ! /^\d{4}-\d{2}-\d{2}$/.test( date ) ) {
		return reply.code( 400 ).send( new Error( 'Invalid entry date' ) );
	}

	try {
		const rawEntry = await fs.readFile(
			resolve( entriesDir, `${ date }.md` ),
			'utf-8'
		);
		const parsedEntry = mdToDraftjs( rawEntry );

		return reply.send( parsedEntry );
	} catch ( err ) {
		server.log.error( err );
		return reply.code( 404 ).send( new Error( 'Entry not found' ) );
	}
} );

// Saves a journal entry.
server.post< GetEntry & PostEntry >( '/api/entry', async ( req, reply ) => {
	const { date } = req.query;
	if ( ! date ) {
		return reply
			.code( 400 )
			.send( new Error( 'Please provide an entry date' ) );
	}

	if ( ! /^\d{4}-\d{2}-\d{2}$/.test( date ) ) {
		return reply.code( 400 ).send( new Error( 'Invalid entry date' ) );
	}

	if ( ! req.body ) {
		return reply.code( 400 ).send( new Error( 'Requires body' ) );
	}

	let markdown: string;
	try {
		markdown = draftjsToMd( req.body ).trim();
	} catch ( err ) {
		console.error( err );
		return reply.code( 400 ).send( new Error( 'Invalid state object' ) );
	}

	if ( ! markdown ) {
		return reply
			.code( 400 )
			.send( new Error( 'Cannot save empty journal entry' ) );
	}

	try {
		await fs.writeFile( resolve( entriesDir, `${ date }.md` ), markdown, {
			encoding: 'utf-8',
		} );
	} catch ( err ) {
		console.error( err );
		return reply.code( 500 ).send( new Error( 'Cannot save file' ) );
	}

	return reply.send( { success: true } );
} );

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
