import React from 'react';
import NotesView from './Notes.view';
import { getGameDocRef } from '../../../../util/db';

interface Props {
	name: string;
}
interface State {
	isOpen: boolean;
	content: string;
}

class NotesContainer extends React.Component<Props, State> {
	state: State = {
		isOpen: false,
		content: '',
	};

	componentDidMount() {
		getGameDocRef().onSnapshot(
			snap => {
				const { notes } = (snap.data() as DB.GameDoc | undefined) ?? {};
				if (notes && notes[this.props.name])
					this._updateContent(notes[this.props.name]);
			},
			err => console.error(err)
		);
	}

	_timeout: NodeJS.Timeout | null = null;
	_updateContent = (value: string) => {
		this.setState({
			content: value,
		});
	};

	_updateDB = (value: string) => {
		getGameDocRef().update({
			[`notes.${this.props.name}`]: value,
		});
	};

	_handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const content = e.currentTarget.value;
		this._updateContent(content);

		if (this._timeout) clearTimeout(this._timeout);
		this._timeout = setTimeout(() => {
			this._updateDB(content);
		}, 1000);
	};

	_openNotes = () => {
		this.setState({
			isOpen: true,
		});
	};

	_closeNotes = () => {
		this.setState({
			isOpen: false,
		});
	};

	render() {
		return (
			<NotesView
				{...{
					closeNotes: this._closeNotes,
					openNotes: this._openNotes,
					content: this.state.content,
					handleChange: this._handleChange,
					isOpen: this.state.isOpen,
				}}
			/>
		);
	}
}

export default NotesContainer;
