import { cleanup, fireEvent, render } from '@testing-library/react';
import React from 'react';
import { exposeMockFirebaseApp } from 'ts-mock-firebase';
// import waitForExpect from 'wait-for-expect';

import { app as firebaseApp } from '../../../../../mocks/firebase';
import SuspectSelectorsContainerImport from './SuspectSelectors.container';
import SuspectSelectorsView from './SuspectSelectors.view';

const mockFirestore = exposeMockFirebaseApp(firebaseApp).firestore();

beforeAll(() => {
	jest.mock('./SuspectSelectors.view.tsx', () => () => <div />);
	jest.mock('../../../../../util/db', () => ({
		getGameDocRef: jest.fn().mockReturnValue(mockFirestore.doc('games/game')),
	}));
	jest.mock('../../../../../index.tsx', () => ({
		db: mockFirestore,
	}));
});
afterEach(cleanup);
afterEach(jest.resetModules);
afterEach(mockFirestore.mocker.reset);

it('renders', () => {
	const SuspectSelectorsContainer = require('./SuspectSelectors.container')
		.default as typeof SuspectSelectorsContainerImport;
	const { asFragment } = render(
		<SuspectSelectorsContainer showLegend={true} suspectId={1} />
	);

	expect(asFragment()).toMatchSnapshot();
});

it('stopPropagation works correctly', () => {
	const onParentClick = jest.fn();
	jest.doMock(
		'./SuspectSelectors.view.tsx',
		() => (props: React.ComponentProps<typeof SuspectSelectorsView>) => {
			return (
				<div onClick={onParentClick}>
					<div data-testid="child" onClick={props.stopPropagation}></div>
				</div>
			);
		}
	);

	const SuspectSelectorsContainer = require('./SuspectSelectors.container')
		.default as typeof SuspectSelectorsContainerImport;
	const { getByTestId } = render(
		<SuspectSelectorsContainer showLegend={true} suspectId={1} />
	);

	fireEvent.click(getByTestId('child'));

	expect(onParentClick).not.toHaveBeenCalled();
});

// Cannot test Firestore transactions
/* it('marks suspect', async () => {
	jest.doMock('./SuspectSelectors.view.tsx', () =>
		jest
			.fn()
			.mockImplementationOnce(
				(props: React.ComponentProps<typeof SuspectSelectorsView>) => {
					props.handleMarkChange();
					return <div />;
				}
			)
			.mockImplementation(() => <div />)
	);

	const SuspectSelectorsContainer = require('./SuspectSelectors.container')
		.default as typeof SuspectSelectorsContainerImport;
	render(<SuspectSelectorsContainer showLegend={true} suspectId={1} />);

	await waitForExpect(() => {
		expect(mockFirestore.doc('games/game').data).toEqual(
			expect.objectContaining({
				marked_suspects: [1],
			} as Partial<DB.GameDoc>)
		);
	}, 3000);
}); */

it.todo('hides suspect');
