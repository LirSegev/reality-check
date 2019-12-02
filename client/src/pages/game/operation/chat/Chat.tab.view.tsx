import * as React from 'react';
import { Page } from 'react-onsenui';
import ChatItem from './ChatItem.component';
import ChatInput from './ChatInput.component';
import { ChatItem as ChatItemType } from '../../../../util/db.types';

interface Props {
	messages: [ChatItemType, string][];
	isLoading: boolean;
}

const ChatTabView: React.FC<Props> = props => {
	const chatItems = props.messages.map(message => (
		<ChatItem
			key={`chat-message_${message[1]}`}
			author={message[0].author}
			message={message[0].message}
			timestamp={message[0].timestamp}
		/>
	));
	return (
		<Page id="chat-page" renderFixed={() => <ChatInput />}>
			{props.isLoading ? (
				<div
					data-testid="loader"
					style={{
						margin: 'auto',
						width: 'fit-content',
						position: 'relative',
						top: '50%',
						marginTop: '-0.5em',
					}}
				>
					Loading...
				</div>
			) : (
				chatItems
			)}
		</Page>
	);
};

export default ChatTabView;
