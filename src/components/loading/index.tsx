import { Box, CircularProgress } from '@material-ui/core';

export default function Loading( { margin = 2 } ) {
	return (
		<Box my={ margin } textAlign="center">
			<CircularProgress />
		</Box>
	);
}
