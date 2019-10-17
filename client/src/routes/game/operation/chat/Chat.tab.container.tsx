import React from 'react';
import ChatTabView from './Chat.tab.view';
import firebase from 'firebase/app';
import { ReduxState } from '../../../../reducers/initialState';
import { connect } from 'react-redux';

interface State {
	messages: [ChatDoc, string][];
	isLoading: boolean;
}
interface Props {
	gameId: string | null;
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
		const db = firebase.firestore();
		const { gameId } = this.props;

		if (gameId)
			db.collection(`games/${gameId}/chat`)
				.orderBy('timestamp')
				.onSnapshot(this._updateMessages, err =>
					console.error(new Error('Error getting chat docs'), err)
				);
		else console.error(new Error('gameId is null'));
	}

	_updateMessages(chatDocs: firebase.firestore.QuerySnapshot) {
		const newMessages: [ChatDoc, string][] = [];
		chatDocs.docChanges().forEach(changes => {
			if (changes.type === 'added') {
				newMessages.push([changes.doc.data() as ChatDoc, changes.doc.id]);
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

const mapState = (state: ReduxState) => ({
	gameId: state.main.gameId,
});
export default connect(mapState)(ChatTabContainer);
