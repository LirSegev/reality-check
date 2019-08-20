import React from 'react';
import ChatTabView from './Chat.tab.view';

class ChatTabContainer extends React.Component {
	componentDidMount() {
		setTimeout(() => {
			this.scrollChatTabToBottom();
		}, 0);
	}

	scrollChatTabToBottom() {
		const chatPageContent = document.querySelector('#chat-page .page__content');
		if (chatPageContent)
			chatPageContent.scrollTo(0, chatPageContent.scrollHeight);
	}

	render = () => <ChatTabView />;
}

export default ChatTabContainer;
