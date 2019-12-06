import { cleanup, render } from '@testing-library/react';
import React from 'react';
import { exposeMockFirebaseApp, MockTimestamp } from 'ts-mock-firebase';

import { app as firebaseApp } from '../../../../mocks/firebase';
import { ChatItem } from '../../../../util/db.types';
import ChatTabContainerImport from './Chat.tab.container';
import ChatTabViewImport from './Chat.tab.view';
import waitForExpect from 'wait-for-expect';

const mockFirestore = exposeMockFirebaseApp(firebaseApp).firestore();
beforeAll(() => {
	jest.mock('./Chat.tab.view.tsx', () => () => <div />);
	jest.mock('firebase/app');
	jest.mock('../../../../util/db', () => ({
		getGameDocRef: () => mockFirestore.doc('games/game'),
	}));
});
afterEach(cleanup);
afterEach(jest.resetModules);
afterEach(mockFirestore.mocker.reset);

it('renders', () => {
	const ChatTabContainer = require('./Chat.tab.container')
		.default as typeof ChatTabContainerImport;
	const { asFragment } = render(
		<ChatTabContainer incrementUnreadNum={() => true} />
	);

	expect(asFragment()).toMatchSnapshot();
});

// TODO: fix mockFirestore to call snapshot listener on init
it.skip('displays preexisting messages', async () => {
	mockFirestore.mocker.loadDocument('games/game/chat/someDocId', {
		author: {
			displayName: 'someName',
			uid: 'someUid',
		},
		message: 'someMessage',
		timestamp: { seconds: 22, nanoseconds: 0 },
	} as ChatItem);

	jest.doMock('./Chat.tab.view.tsx', () => jest.fn().mockReturnValue(<div />));

	const ChatTabContainer = require('./Chat.tab.container')
		.default as typeof ChatTabContainerImport;
	render(<ChatTabContainer incrementUnreadNum={() => true} />);

	const ChatTabView = require('./Chat.tab.view');
	await waitForExpect(() => {
		expect(ChatTabView).toHaveBeenCalledWith(
			{
				isLoading: false,
				messages: [
					[
						{
							author: {
								displayName: 'someName',
								uid: 'someUid',
							},
							message: 'someMessage',
							timestamp: { seconds: 22, nanoseconds: 0 },
						},
						'someDocId',
					],
				],
			} as React.ComponentProps<typeof ChatTabViewImport>,
			{}
		);
	}, 3500);
});

it('updates messages on new message', async () => {
	mockFirestore.mocker.loadDocument('games/game/chat/someDocId', {
		author: {
			displayName: 'someName',
			uid: 'someUid',
		},
		message: 'someMessage',
		timestamp: new MockTimestamp(22, 0),
	} as ChatItem);

	jest.doMock('./Chat.tab.view.tsx', () => jest.fn().mockReturnValue(<div />));

	const ChatTabContainer = require('./Chat.tab.container')
		.default as typeof ChatTabContainerImport;
	const { getByText } = render(
		<ChatTabContainer incrementUnreadNum={() => true} />
	);

	mockFirestore.doc('games/game/chat/anotherDocId').set({
		author: {
			displayName: 'anotherName',
			uid: 'anotherUid',
		},
		message: 'anotherMessage',
		timestamp: new MockTimestamp(43, 0),
	} as ChatItem);

	const ChatTabView = require('./Chat.tab.view');
	await waitForExpect(() => {
		expect(ChatTabView).toHaveBeenLastCalledWith(
			{
				isLoading: false,
				messages: [
					[
						{
							author: {
								displayName: 'anotherName',
								uid: 'anotherUid',
							},
							message: 'anotherMessage',
							timestamp: new MockTimestamp(43, 0),
						},
						'anotherDocId',
					],
				],
			} as React.ComponentProps<typeof ChatTabViewImport>,
			{}
		);
	}, 3500);
});

it('calls scrollChatTabToBottom on new chat message', async () => {
	mockFirestore.mocker.loadDocument('games/game/chat/someDocId', {
		author: {
			displayName: 'someName',
			uid: 'someUid',
		},
		message: 'someMessage',
		timestamp: new MockTimestamp(22, 0),
	} as ChatItem);

	jest.doMock('./Chat.tab.view.tsx', () => jest.fn().mockReturnValue(<div />));

	const ChatTabContainer = require('./Chat.tab.container')
		.default as typeof ChatTabContainerImport;
	const scrollToBottom = jest.spyOn(
		ChatTabContainer.prototype,
		'_scrollChatTabToBottom'
	);
	render(<ChatTabContainer incrementUnreadNum={() => true} />);

	mockFirestore.doc('games/game/chat/anotherDocId').set({
		author: {
			displayName: 'anotherName',
			uid: 'anotherUid',
		},
		message: 'anotherMessage',
		timestamp: new MockTimestamp(43, 0),
	} as ChatItem);

	await waitForExpect(() => {
		expect(scrollToBottom).toBeCalled();
	});
});
