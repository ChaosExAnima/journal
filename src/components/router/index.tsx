import { useHistory, BrowserRouter as ReactRouter } from 'react-router-dom';
import { useCurrentDate } from 'components/data';
import { useEffect, ReactNode } from 'react';
import { PropsChildren } from 'react-app-env';

function Router( { children }: NonNullable< PropsChildren > ): ReactNode {
	const currentDate = useCurrentDate();
	const history = useHistory();

	useEffect( () => {
		console.log( history, currentDate );
		if ( ! history || ! currentDate ) {
			return;
		}
		const dateString = currentDate.format( '/YYYY/MM/DD' );
		history.push( dateString );
	}, [ currentDate, history ] );

	return children;
}

const WrappedRouter = ( { children }: PropsChildren ) => (
	<ReactRouter>
		<Router>{ children }</Router>
	</ReactRouter>
);

export default WrappedRouter;
