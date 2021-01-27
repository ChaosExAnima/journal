import { useState } from 'react';
import Editor from '@draft-js-plugins/editor';
import createLinkifyPlugin from '@draft-js-plugins/linkify';
import {
	ContentState,
	DraftEditorCommand,
	DraftHandleValue,
	EditorState,
	RichUtils,
} from 'draft-js';
import { createStyles, Link, makeStyles, Typography } from '@material-ui/core';

import 'draft-js/dist/Draft.css';

type EntryEditorProps = {
	className?: string;
	placeholder?: string;
	entry?: ContentState;
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
	entry,
}: EntryEditorProps ) {
	const [ editorState, setEditorState ] = useState(
		entry
			? EditorState.createWithContent( entry )
			: EditorState.createEmpty()
	);
	const classes = useStyles();

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
