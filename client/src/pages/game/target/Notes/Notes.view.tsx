import React from 'react';
import { Dialog, Icon } from 'react-onsenui';

interface Props {
	isOpen: boolean;
	closeNotes: () => void;
	openNotes: () => void;
	handleChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
	content: string;
}

const NotesView: React.FC<Props> = ({
	isOpen,
	closeNotes,
	openNotes,
	handleChange,
	content,
}) => (
	<div>
		<div onClick={openNotes}>
			<Icon size={20} icon="fa-list-ul" />
		</div>
		<Dialog isOpen={isOpen} onCancel={closeNotes}>
			<textarea onChange={handleChange} value={content}></textarea>
		</Dialog>
	</div>
);

export default NotesView;
