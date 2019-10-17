import React from 'react';
import styles from './Chat.module.css';
import { Button } from 'react-onsenui';
import firebase from 'firebase/app';
import { dateToTimestamp } from '../../../../util/db';
import { ReduxState } from '../../../../reducers/initialState';
import { connect } from 'react-redux';

interface Props {
	gameId: string | null;
}

class ChatInput extends React.Component<Props> {
	constructor(props: Props) {
		super(props);
		this.handleSend = this.handleSend.bind(this);
	}

	handleSend(e?: React.MouseEvent<HTMLElement, MouseEvent>) {
		if (this.props.gameId) {
			const inputEl = this.refs.input as HTMLDivElement;
			const db = firebase.firestore();
			const { displayName, uid } = firebase.auth().currentUser!;
			db.collection(`games/${this.props.gameId}/chat`).add({
				author: {
					displayName,
					uid,
				},
				message: inputEl.innerText,
				timestamp: dateToTimestamp(new Date()),
			} as ChatDoc);

			inputEl.innerHTML = '';
		} else console.error(new Error('gameId is null'));
	}

	render() {
		return (
			<div id={styles.chatInputGradient}>
				<div id={styles.chatInputWrapper}>
					<div
						contentEditable
						ref="input"
						className={`textarea textarea--transparent ${styles.underbar}`}
						id={styles.chatInput}
						placeholder="Type a message"
					/>
					<Button id={styles.sendButton} onClick={this.handleSend}>
						Send
					</Button>
				</div>
			</div>
		);
	}
}

const mapState = (state: ReduxState) => ({
	gameId: state.main.gameId,
});
export default connect(mapState)(ChatInput);
