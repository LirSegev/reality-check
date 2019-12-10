import { cleanup, render } from '@testing-library/react';
import React from 'react';
import { Page } from 'react-onsenui';

import ChatTabViewImport from './Chat.tab.view';
import ChatItemComponent from './ChatItem.component';
import ActionItemComponent from './ActionItem.component';

beforeEach(() => {
	jest.mock('./ChatInput.component.tsx', () => () => <div />);
	jest.mock('react-onsenui', () => ({
		Page: (
			props: React.PropsWithChildren<React.ComponentProps<typeof Page>>
		) => (
			<div data-testid="onsenpage">
				<div data-testid="onsenpage_content">{props.children}</div>
				<div data-testif="onsenpage_fixed">
					{(props.renderFixed!() as unknown) as JSX.Element}
				</div>
			</div>
		),
	}));
	jest.mock(
		'./ChatItem.component.tsx',
		() => (props: React.ComponentPropsWithoutRef<typeof ChatItemComponent>) => (
			<div className="chat_message">
				<div>{props.author.displayName}</div>
				<div>{props.message}</div>
			</div>
		)
	);
	jest.mock(
		'./ActionItem.component.tsx',
		() => (
			props: React.ComponentPropsWithoutRef<typeof ActionItemComponent>
		) => {
			const { subject, action } = props.action;
			return (
				<div className="chat_action">
					<div>{subject.displayName}</div>
					<div>{action}</div>
				</div>
			);
		}
	);
});
afterEach(cleanup);
afterEach(jest.resetModules);

it('renders', () => {
	jest.doMock('./ChatItem.component.tsx', () => () => (
		<div className="chat_message" />
	));
	jest.doMock('./ActionItem.component.tsx', () => () => (
		<div className="chat_action" />
	));
	const firebase = require('firebase');
	const ChatTabView = require('./Chat.tab.view')
		.default as typeof ChatTabViewImport;
	const { asFragment } = render(
		<ChatTabView
			isLoading={false}
			actions={[
				[
					{
						subject: {
							displayName: 'someName',
							uid: 'someUid',
						},
						action: 'collected',
						object: {
							type: 'detective',
						},
						timestamp: new firebase.firestore.Timestamp(12, 0),
					},
					'action_id',
				],
			]}
			messages={[
				[
					{
						author: {
							displayName: 'someName',
							uid: 'someUid',
						},
						message: 'someMessage',
						timestamp: new firebase.firestore.Timestamp(10, 0),
					},
					'id',
				],
			]}
		/>
	);

	expect(asFragment()).toMatchSnapshot();
});

it('displays messages', () => {
	const firebase = require('firebase');
	const ChatTabView = require('./Chat.tab.view')
		.default as typeof ChatTabViewImport;
	const { getByText } = render(
		<ChatTabView
			isLoading={false}
			actions={[]}
			messages={[
				[
					{
						author: {
							displayName: 'someName',
							uid: 'someUid',
						},
						message: 'someMessage',
						timestamp: new firebase.firestore.Timestamp(10, 0),
					},
					'id',
				],
			]}
		/>
	);

	expect(getByText('someName')).toBeVisible();
	expect(getByText('someMessage')).toBeVisible();
});

it('displays actions', () => {
	const firebase = require('firebase');
	const ChatTabView = require('./Chat.tab.view')
		.default as typeof ChatTabViewImport;
	const { getByText } = render(
		<ChatTabView
			isLoading={false}
			messages={[]}
			actions={[
				[
					{
						subject: {
							uid: 'someUid',
							displayName: 'someName',
						},
						action: 'collected',
						object: {
							type: 'intelligence',
						},
						timestamp: new firebase.firestore.Timestamp(12, 0),
					},
					'someDocId',
				],
			]}
		/>
	);

	expect(getByText('someName')).toBeVisible();
	expect(getByText('collected')).toBeVisible();
	// expect(getByText('intelligence')).toBeVisible();
});

it.todo('displays messages and actions sorted by timestamp');

it('shows loader', () => {
	const ChatTabView = require('./Chat.tab.view')
		.default as typeof ChatTabViewImport;
	const { getByTestId } = render(
		<ChatTabView isLoading={true} messages={[]} actions={[]} />
	);

	expect(getByTestId('loader')).toBeVisible();
});
