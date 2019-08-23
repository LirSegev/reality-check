import React from 'react';
import ChatTabView from './Chat.tab.view';
import firebase from 'firebase/app';

interface State {
	messages: [ChatDoc, string][];
}
interface Props {
	gameId: string;
}

class ChatTabContainer extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			messages: [],
		};

		this.updateMessages = this.updateMessages.bind(this);
	}

	componentDidMount() {
		setTimeout(() => {
			this.scrollChatTabToBottom();
		}, 0);

		const db = firebase.firestore();
		const { gameId } = this.props;

		db.collection(`games/${gameId}/chat`)
			.orderBy('timestamp')
			.onSnapshot(this.updateMessages, err =>
				console.error(new Error('Error getting chat docs'), err)
			);
	}

	updateMessages(chatDocs: firebase.firestore.QuerySnapshot) {
		const newMessages: [ChatDoc, string][] = [];
		chatDocs.docChanges().forEach(changes => {
			if (changes.type === 'added') {
				newMessages.push([changes.doc.data() as ChatDoc, changes.doc.id]);
			}
		});
		this.setState(prevState => ({
			messages: [...prevState.messages, ...newMessages],
		}));
	}

	scrollChatTabToBottom() {
		const chatPageContent = document.querySelector('#chat-page .page__content');
		if (chatPageContent)
			chatPageContent.scrollTo(0, chatPageContent.scrollHeight);
	}

	render = () => (
		<ChatTabView gameId={this.props.gameId} messages={this.state.messages} />
	);
}

export default ChatTabContainer;
