import React from 'react';
import ChatTabView from './Chat.tab.view';
import firebase from 'firebase/app';

interface State {
	messages: [ChatDoc, string][];
	isLoading: boolean;
}
interface Props {
	gameId: string;
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
		const db = firebase.firestore();
		const { gameId } = this.props;

		db.collection(`games/${gameId}/chat`)
			.orderBy('timestamp')
			.onSnapshot(this._updateMessages, err =>
				console.error(new Error('Error getting chat docs'), err)
			);
	}

	_updateMessages(chatDocs: firebase.firestore.QuerySnapshot) {
		const newMessages: [ChatDoc, string][] = [];
		chatDocs.docChanges().forEach(changes => {
			if (changes.type === 'added') {
				newMessages.push([changes.doc.data() as ChatDoc, changes.doc.id]);
			}
		});
		this.setState(prevState => ({
			messages: [...prevState.messages, ...newMessages],
			isLoading: false,
		}));

		setTimeout(this._scrollChatTabToBottom, 0);
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
			gameId={this.props.gameId}
			messages={this.state.messages}
			isLoading={this.state.isLoading}
		/>
	);
}

export default ChatTabContainer;
