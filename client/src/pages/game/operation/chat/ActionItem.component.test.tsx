import React from 'react';
import { cleanup, render } from '@testing-library/react';
import ActionItem from './ActionItem.component';
import * as firebase from 'firebase';

afterEach(cleanup);

it('renders', () => {
	const { asFragment } = render(
		<ActionItem
			action={{
				subject: {
					uid: 'someUid',
					displayName: 'someName',
				},
				action: 'questioned',
				timestamp: new firebase.firestore.Timestamp(34, 0),
			}}
		/>
	);

	expect(asFragment()).toMatchSnapshot();
});

it('displays player name and action', () => {
	const { getByText } = render(
		<ActionItem
			action={{
				subject: {
					uid: 'someUid',
					displayName: 'someName',
				},
				action: 'questioned',
				timestamp: new firebase.firestore.Timestamp(34, 0),
			}}
		/>
	);

	expect(getByText('someName', { exact: false })).toBeVisible();
	expect(getByText('questioned', { exact: false })).toBeVisible();
});

it.each([
	[
		{
			subject: {
				uid: 'someUid',
				displayName: 'someName',
			},
			action: 'questioned',
			timestamp: new firebase.firestore.Timestamp(10, 0),
		},
		'someName questioned a suspect',
	],
	[
		{
			subject: {
				uid: 'anotherUid',
				displayName: 'anotherName',
			},
			action: 'marked',
			object: {
				id: 1,
				name: 'Tomas',
			},
			timestamp: new firebase.firestore.Timestamp(10, 0),
		},
		'anotherName marked Tomas as the main suspect',
	],
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
			timestamp: new firebase.firestore.Timestamp(10, 0),
		},
		'someName collected a point',
	],
] as [React.ComponentProps<typeof ActionItem>['action'], string][])(
	'displays correct message for each action type',
	(action, expected) => {
		const { getByText } = render(<ActionItem action={action} />);

		expect(getByText(expected)).toBeVisible();
	}
);
