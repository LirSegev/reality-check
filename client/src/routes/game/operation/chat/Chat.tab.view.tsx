import * as React from 'react';
import { Page } from 'react-onsenui';
import ChatItem from './ChatItem.component';
import styles from './Chat.module.css';

const ChatTabView: React.FC = () => {
	const messages = [
		{
			author: {
				uid: 'string',
				displayName: 'lir',
			},
			message:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas eget suscipit tellus. Mauris ultrices tellus viverra diam tempus dapibus.Sed erat elit, porta quis pulvinar laoreet, aliquet eget elit.',
			timestamp: 1566141220208,
		},
		{
			author: {
				uid: 'string',
				displayName: 'tom',
			},
			message:
				'Fusce iaculis vehicula nibh, et dignissim justo pellentesque nec. Etiam urna ipsum, blandit a nibh eu, vestibulum facilisis nunc.',
			timestamp: 1566142230208,
		},
		{
			author: {
				uid: 'string',
				displayName: 'lir',
			},
			message:
				'Fusce iaculis vehicula nibh, et dignissim justo pellentesque nec. Etiam urna ipsum, blandit a nibh eu, vestibulum facilisis nunc.',
			timestamp: 1566143240208,
		},
		{
			author: {
				uid: 'string',
				displayName: 'tom',
			},
			message: 'Sed erat elit, porta quis pulvinar laoreet, aliquet eget elit.',
			timestamp: 1566144240208,
		},
	];
	const chatItems = messages.map(message => (
		<ChatItem
			author={message.author}
			message={message.message}
			timestamp={message.timestamp}
		/>
	));
	return (
		<Page
			renderFixed={() => (
				<div className={styles.chatInputWrapper}>
					<div
						contentEditable
						className={`textarea textarea--transparent ${styles.underbar} ${
							styles.chatInput
						}`}
						placeholder="Type a message"
					/>
				</div>
			)}
		>
			{chatItems}
		</Page>
	);
};

export default ChatTabView;
