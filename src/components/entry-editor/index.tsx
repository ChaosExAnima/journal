import React, { useEffect, useRef, useState } from 'react';
import Editor from '@draft-js-plugins/editor';
import createLinkifyPlugin from '@draft-js-plugins/linkify';
import {
	DraftEditorCommand,
	DraftHandleValue,
	EditorState,
	RichUtils,
} from 'draft-js';
import { createStyles, Link, makeStyles, Typography } from '@material-ui/core';
import 'draft-js/dist/Draft.css';

import { useCurrentEntry, useStore } from 'components/data/hooks';
import { LoadingState } from 'components/data/constants';
import Loading from 'components/loading';

type EntryEditorProps = {
	className?: string;
	placeholder?: string;
};

const useStyles = makeStyles( ( theme ) =>
	createStyles( {
		root: {
			fontSize: '1.2rem',
			lineHeight: 1.8,
			height: '100%',

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
}: EntryEditorProps ) {
	const classes = useStyles();
	const entry = useCurrentEntry();
	const { currentDate: date, updateEntry, currentDraft } = useStore();
	const [ editorState, setEditorState ] = useState(
		EditorState.createEmpty()
	);
	const editorRef = useRef< Editor >( null );
	useEffect( () => {
		if ( ! entry || entry === LoadingState || 'error' in entry ) {
			return;
		}
		setEditorState( EditorState.createWithContent( entry ) );
	}, [ entry, date ] );

	useEffect( () => {
		if ( ! currentDraft && editorState.getCurrentContent().hasText() ) {
			editorRef.current?.focus();
		}
	}, [ currentDraft, editorState ] );

	if ( entry === LoadingState ) {
		return <Loading margin={ 4 } />;
	}

	const onChange = ( state: EditorState ) => {
		updateEntry( state.getCurrentContent() );
		setEditorState( state );
	};
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
				onChange={ onChange }
				handleKeyCommand={ handleKeyCommand }
				placeholder={ placeholder }
				plugins={ [ createLinkifyPlugin( { component: Link } ) ] }
				ref={ editorRef }
			/>
		</Typography>
	);
}
