import firebase from 'firebase/app';
import React from 'react';
import { Button } from 'react-onsenui';
import { getGameDocRef } from '../../../../util/db';
import styles from './Chat.module.css';
import { ChatItem } from '../../../../util/db.types';

class ChatInput extends React.Component {
	constructor(props: {}) {
		super(props);

		this.handleSend = this.handleSend.bind(this);
	}

	handleSend(e?: React.MouseEvent<HTMLElement, MouseEvent>) {
		const inputEl = this.refs.input as HTMLDivElement;
		const { displayName, uid } = firebase.auth().currentUser!;
		const chatItem: ChatItem = {
			author: {
				displayName,
				uid,
			},
			message: inputEl.innerText,
			timestamp: firebase.firestore.Timestamp.fromDate(new Date()),
		};
		getGameDocRef()
			.collection('chat')
			.add(chatItem);

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
