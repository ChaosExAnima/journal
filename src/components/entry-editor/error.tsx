import { Button, Typography } from '@material-ui/core';
import { Component } from 'react';

type EntryErrorProps = {
	onError?: ( arg0: Error ) => void;
};

type EntryErrorState = {
	hasError: boolean;
	showError: boolean;
	error?: Error;
};

export default class EntryError extends Component<
	EntryErrorProps,
	EntryErrorState
> {
	state: EntryErrorState = {
		hasError: false,
		showError: true,
	};

	static getDerivedStateFromError( error: Error ) {
		return {
			hasError: true,
			error,
		};
	}

	componentDidCatch( error: Error ) {
		const { onError } = this.props;
		if ( onError ) {
			// eslint-disable-next-line no-console
			console.error( error );
			onError( error );
		}
	}

	dismissError() {
		this.setState( {
			...this.state,
			showError: false,
		} );
	}

	render() {
		const { error, showError } = this.state;

		if ( error && showError ) {
			return (
				<>
					<Typography variant="h4">Error: { error.name }</Typography>
					<Typography variant="body1">{ error.message }</Typography>
					<p>
						<Button
							onClick={ this.dismissError.bind( this ) }
							color="primary"
							variant="contained"
						>
							Delete entry
						</Button>
					</p>
				</>
			);
		}

		return this.props.children;
	}
}
