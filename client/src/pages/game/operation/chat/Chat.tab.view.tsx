import { fold, left } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';
import { Errors } from 'io-ts';
import { PathReporter } from 'io-ts/lib/PathReporter';
import * as React from 'react';
import { Page } from 'react-onsenui';

import {
	ChatItem as ChatItemType,
	ChatItemCodec,
	PlayerAction,
	PlayerActionCodec,
} from '../../../../util/db.types';
import ActionItem from './ActionItem.component';
import ChatInput from './ChatInput.component';
import ChatItem from './ChatItem.component';

interface Props {
	messages: [ChatItemType, string][];
	actions: [PlayerAction, string][];
	isLoading: boolean;
}

const ChatTabView: React.FC<Props> = props => {
	const { messages, actions } = props;
	const chatMessagesAndActions = [...messages, ...actions].sort(
		(a, b) => a[0].timestamp.toMillis() - b[0].timestamp.toMillis()
	);

	const els = chatMessagesAndActions.map(data => {
		let result: React.ReactElement | undefined = undefined;
		let errors: Errors[] = [];

		//* Handle  messages
		pipe(
			ChatItemCodec.decode(data[0]),
			fold(
				err => {
					errors.push(err);
				},
				message => {
					result = (
						<ChatItem
							key={`chat-message_${data[1]}`}
							author={message.author}
							message={message.message}
							timestamp={message.timestamp}
						/>
					);
				}
			)
		);
		//* Handle actions
		if (!result)
			pipe(
				PlayerActionCodec.decode(data[0]),
				fold(
					err => {
						errors.push(err);
					},
					action => {
						result = (
							<ActionItem key={`chat-message_${data[1]}`} action={action} />
						);
					}
				)
			);

		//* Error not message or action
		if (!result)
			errors.forEach(err => {
				console.error(PathReporter.report(left(err)));
			});
		return result;
	});

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
				els
			)}
		</Page>
	);
};

export default ChatTabView;
