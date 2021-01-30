import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import Editor from '@draft-js-plugins/editor';
import createLinkifyPlugin from '@draft-js-plugins/linkify';
import {
	DraftEditorCommand,
	DraftHandleValue,
	EditorState,
	RichUtils,
} from 'draft-js';
import {
	CircularProgress,
	createStyles,
	Link,
	makeStyles,
	Typography,
} from '@material-ui/core';
import 'draft-js/dist/Draft.css';

import { useApiEntry } from 'components/data';

type EntryEditorProps = {
	date: dayjs.Dayjs;
	className?: string;
	placeholder?: string;
	skipLoad?: boolean;
};

const useStyles = makeStyles( ( theme ) =>
	createStyles( {
		root: {
			fontSize: '1.2rem',
			lineHeight: 1.8,
			'& .public-DraftEditorPlaceholder-root': {
				color: theme.palette.text.secondary,
			},
			'& .MuiLink-root': {
				cursor: 'pointer',
			},
		},
	} )
);

export default function EntryEditor( {
	className: addClassName,
	placeholder,
	date,
	skipLoad = false,
}: EntryEditorProps ) {
	const classes = useStyles();
	const { loading, data: entry } = useApiEntry( date );
	const [ editorState, setEditorState ] = useState(
		EditorState.createEmpty()
	);
	const entryExists = !! entry;
	useEffect( () => {
		if ( ! skipLoad && entry ) {
			setEditorState( EditorState.createWithContent( entry ) );
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ entryExists, loading, date ] );

	if ( loading ) {
		return <CircularProgress />;
	}

	const handleKeyCommand = (
		command: DraftEditorCommand,
		newEditorState: EditorState
	): DraftHandleValue => {
		const newState = RichUtils.handleKeyCommand( newEditorState, command );
		if ( newState ) {
			setEditorState( newState );
			return 'handled';
		}
		return 'not-handled';
	};

	return (
		<Typography
			variant="body1"
			className={ classes.root + ' ' + addClassName }
			component="div"
		>
			<Editor
				editorState={ editorState }
				onChange={ setEditorState }
				handleKeyCommand={ handleKeyCommand }
				placeholder={ placeholder }
				plugins={ [ createLinkifyPlugin( { component: Link } ) ] }
			/>
		</Typography>
	);
}
