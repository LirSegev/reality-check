import React from 'react';
import { Dialog, Icon } from 'react-onsenui';
import styles from './Notes.module.css';

interface Props {
	isOpen: boolean;
	closeNotes: () => void;
	openNotes: () => void;
	handleChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
	content: string;
	name: string;
}

const NotesView: React.FC<Props> = ({
	isOpen,
	closeNotes,
	openNotes,
	handleChange,
	name,
	content,
}) => (
	<div id={styles.notesWrapper}>
		<div id={styles.openNotesIconWrapper} onClick={openNotes}>
			<Icon size={20} icon="fa-edit" />
		</div>
		<Dialog isOpen={isOpen} onCancel={closeNotes}>
			<div className="ui form">
				<textarea
					name={name}
					onChange={handleChange}
					value={content}
				></textarea>
			</div>
		</Dialog>
	</div>
);

export default NotesView;
