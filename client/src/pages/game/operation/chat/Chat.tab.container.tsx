import React from 'react';
import ChatTabView from './Chat.tab.view';
import firebase from 'firebase/app';
import { getGameDocRef } from '../../../../util/db';
import { ChatItem, PlayerAction } from '../../../../util/db.types';

interface State {
	messages: [ChatItem, string][];
	actions: [PlayerAction, string][];
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
			actions: [],
			isLoading: true,
		};

		this._updateMessages = this._updateMessages.bind(this);
		this._updateActions = this._updateActions.bind(this);
	}

	componentDidMount() {
		getGameDocRef()
			.collection('chat')
			.orderBy('timestamp') // TODO: test if chat.tab.view sorts correctly, and if so remove
			.onSnapshot(this._updateMessages, err =>
				console.error(new Error('Error getting chat docs'), err)
			);

		getGameDocRef()
			.collection('actions')
			.onSnapshot(this._updateActions, err =>
				console.error(new Error('Error getting action docs'), err)
			);
	}

	_updateActions(actionDocs: firebase.firestore.QuerySnapshot) {
		const newActions: [PlayerAction, string][] = [];
		actionDocs.docChanges().forEach(changes => {
			if (changes.type === 'added') {
				newActions.push([changes.doc.data() as PlayerAction, changes.doc.id]);
				// this.props.incrementUnreadNum('chat');
			}
		});
		this.setState(prevState => ({
			actions: [...prevState.actions, ...newActions],
			isLoading: false,
		}));

		requestAnimationFrame(this._scrollChatTabToBottom);
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
			actions={this.state.actions}
			isLoading={this.state.isLoading}
		/>
	);
}

export default ChatTabContainer;
