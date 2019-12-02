import { cleanup, render } from '@testing-library/react';
import React from 'react';
import { MockTimestamp } from 'ts-mock-firebase';

import ChatTabViewImport from './Chat.tab.view';
import ChatItemComponent from './ChatItem.component';
import { Page } from 'react-onsenui';

beforeEach(() => {
	jest.mock('./ChatInput.component.tsx', () => () => <div />);
	jest.mock('react-onsenui', () => ({
		Page: (
			props: React.PropsWithChildren<React.ComponentProps<typeof Page>>
		) => (
			<div>
				<div>{props.children}</div>
				<div>{(props.renderFixed!() as unknown) as JSX.Element}</div>
			</div>
		),
	}));
	jest.mock(
		'./ChatItem.component.tsx',
		() => (props: React.ComponentPropsWithoutRef<typeof ChatItemComponent>) => (
			<div>
				<div>{props.author.displayName}</div>
				<div>{props.message}</div>
			</div>
		)
	);
});
afterEach(cleanup);
afterEach(jest.resetModules);

it('renders', () => {
	jest.doMock('./ChatItem.component.tsx', () => () => <div />);
	const ChatTabView = require('./Chat.tab.view')
		.default as typeof ChatTabViewImport;
	const { asFragment } = render(
		<ChatTabView
			isLoading={false}
			messages={[
				[
					{
						author: {
							displayName: 'someName',
							uid: 'someUid',
						},
						message: 'someMessage',
						timestamp: new MockTimestamp(10, 0),
					},
					'id',
				],
			]}
		/>
	);

	expect(asFragment()).toMatchSnapshot();
});

it('displays messages', () => {
	const ChatTabView = require('./Chat.tab.view')
		.default as typeof ChatTabViewImport;
	const { getByText } = render(
		<ChatTabView
			isLoading={false}
			messages={[
				[
					{
						author: {
							displayName: 'someName',
							uid: 'someUid',
						},
						message: 'someMessage',
						timestamp: new MockTimestamp(10, 0),
					},
					'id',
				],
			]}
		/>
	);

	expect(getByText('someName')).toBeVisible();
	expect(getByText('someMessage')).toBeVisible();
});

it.todo('displays actions');

it('shows loader', () => {
	const ChatTabView = require('./Chat.tab.view')
		.default as typeof ChatTabViewImport;
	const { getByTestId } = render(
		<ChatTabView isLoading={true} messages={[]} />
	);

	expect(getByTestId('loader')).toBeVisible();
});
