import React from 'react';
import NotesView from './Notes.view';
import { getGameDocRef } from '../../../../util/db';

interface Props {
	name: string;
}
interface State {
	isOpen: boolean;
	notes: { [name: string]: string };
}

class NotesContainer extends React.Component<Props, State> {
	state: State = {
		isOpen: false,
		notes: {},
	};

	componentDidMount() {
		getGameDocRef().onSnapshot(
			snap => {
				const { notes } = (snap.data() as DB.GameDoc | undefined) ?? {};
				if (notes)
					this.setState({
						notes,
					});
			},
			err => console.error(err)
		);
	}

	_updateContent = (name: string, value: string) => {
		this.setState(prevState => ({
			...prevState,
			notes: {
				...prevState.notes,
				[name]: value,
			},
		}));
	};

	_updateDB = (name: string, value: string) => {
		getGameDocRef().update({
			[`notes.${name}`]: value,
		});
	};

	_timeout: NodeJS.Timeout | null = null;
	_handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		/**
		 * Delay in milliseconds before saving to db
		 */
		const SAVE_DELAY = 1000;

		const content = e.currentTarget.value;
		const name = e.currentTarget.name;

		this._updateContent(name, content);

		if (this._timeout) clearTimeout(this._timeout);
		this._timeout = setTimeout(() => {
			this._updateDB(name, content);
		}, SAVE_DELAY);
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
					content: this.state.notes[this.props.name] ?? '',
					handleChange: this._handleChange,
					isOpen: this.state.isOpen,
					name: this.props.name,
				}}
			/>
		);
	}
}

export default NotesContainer;
