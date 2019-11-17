import React from 'react';
import ChatTabView from './Chat.tab.view';
import firebase from 'firebase/app';
import { getGameDocRef } from '../../../../util/db';
import { ChatItem } from '../../../../util/db.types';

interface State {
	messages: [ChatItem, string][];
	isLoading: boolean;
}
interface Props {
	incrementUnreadNum: (type: UnreadType) => boolean;
}

class ChatTabContainer extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			messages: [],
			isLoading: true,
		};

		this._updateMessages = this._updateMessages.bind(this);
	}

	componentDidMount() {
		getGameDocRef()
			.collection('chat')
			.orderBy('timestamp')
			.onSnapshot(this._updateMessages, err =>
				console.error(new Error('Error getting chat docs'), err)
			);
	}

	_updateMessages(chatDocs: firebase.firestore.QuerySnapshot) {
		const newMessages: [ChatItem, string][] = [];
		chatDocs.docChanges().forEach(changes => {
			if (changes.type === 'added') {
				newMessages.push([changes.doc.data() as ChatItem, changes.doc.id]);
				this.props.incrementUnreadNum('chat');
			}
		});
		this.setState(prevState => ({
			messages: [...prevState.messages, ...newMessages],
			isLoading: false,
		}));

		requestAnimationFrame(this._scrollChatTabToBottom);
	}

	_scrollChatTabToBottom() {
		const chatPageContent = document.querySelector('#chat-page .page__content');
		if (chatPageContent)
			chatPageContent.scrollTo({
				left: 0,
				top: chatPageContent.scrollHeight,
				behavior: 'smooth',
			});
	}

	render = () => (
		<ChatTabView
			messages={this.state.messages}
			isLoading={this.state.isLoading}
		/>
	);
}

export default ChatTabContainer;
