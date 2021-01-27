import micri, { Router } from 'micri';
import staticHandler from 'serve-handler';
import { resolve } from 'path';
import { version } from '../package.json';
import type { IncomingMessage, ServerResponse } from 'http';

const { router, on, otherwise } = Router;

function isPath( req: IncomingMessage, path: string ): boolean {
	const url = req.url ?? '/';
	return url === path;
}

const server = micri(
	router(
		on.get(
			( req: IncomingMessage ) => isPath( req, '/api/entries' ),
			() => []
		),
		on.post(
			( req: IncomingMessage ) => isPath( req, '/api/save' ),
			() => ( { success: true } )
		),
		otherwise( ( req: IncomingMessage, res: ServerResponse ) =>
			process.env.ENVIRONMENT === 'production'
				? staticHandler( req, res, {
						public: resolve( __dirname, '..', 'build' ),
				  } )
				: {
						message:
							'Run `yarn client:start` to start the front-end!',
						version,
				  }
		)
	)
);

const port: number = Number.parseInt( process.env.SERVER_PORT ?? '3002', 10 );
// eslint-disable-next-line no-console
console.log( `Starting API server on port ${ port }!` );
server.listen( port );
