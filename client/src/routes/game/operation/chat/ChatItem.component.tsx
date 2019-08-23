import React from 'react';
import { Card } from 'react-onsenui';
import styles from './Chat.module.css';
import * as firebase from 'firebase/app';

interface Props {
	author: {
		uid: string;
		displayName: string;
	};
	message: string;
	timestamp: firebase.firestore.Timestamp;
}

const ChatItem: React.FC<Props> = props => {
	const time = props.timestamp.toDate().toLocaleTimeString('en-GB', {
		hour: '2-digit',
		minute: '2-digit',
	});
	const isOwn = props.author.uid === firebase.auth().currentUser!.uid;

	const side = isOwn ? styles.right : styles.left;

	return (
		<Card className={[styles.chatItem, side].join(' ')}>
			{!isOwn && (
				<div className={styles.author}>{props.author.displayName}</div>
			)}
			<div className={styles.content}>
				{props.message}
				<div className={styles.time}>{time}</div>
			</div>
		</Card>
	);
};

export default ChatItem;
