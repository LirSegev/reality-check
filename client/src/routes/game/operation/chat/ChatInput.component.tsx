import React from 'react';
import styles from './Chat.module.css';
import { Button } from 'react-onsenui';

class ChatInput extends React.Component {
	render() {
		return (
			<div id={styles.chatInputGradient}>
				<div id={styles.chatInputWrapper}>
					<div
						contentEditable
						className={`textarea textarea--transparent ${styles.underbar}`}
						id={styles.chatInput}
						placeholder="Type a message"
					/>
					<Button id={styles.sendButton}>Send</Button>
				</div>
			</div>
		);
	}
}

export default ChatInput;
