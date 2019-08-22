import React from 'react';
import styles from './Chat.module.css';
import { Button } from 'react-onsenui';
import firebase from 'firebase/app';
import { dateToTimestamp } from '../../../../util/db';

interface Props {
	gameId: string;
}

class ChatInput extends React.Component<Props> {
	constructor(props: Props) {
		super(props);
		this.handleSend = this.handleSend.bind(this);
	}

	handleSend(e?: React.MouseEvent<HTMLElement, MouseEvent>) {
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

export default ChatInput;
