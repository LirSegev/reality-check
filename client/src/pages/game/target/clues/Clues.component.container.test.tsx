import React from 'react';
import { app as firebaseApp } from '../../../../mocks/firebase';
import { exposeMockFirebaseApp } from 'ts-mock-firebase';
import { cleanup, render } from '@testing-library/react';

const mockFirestore = exposeMockFirebaseApp(firebaseApp).firestore();
beforeAll(() => {
	jest.mock('firebase/app');
	jest.mock('./Clues.component.view.tsx', () => () => <div />);
	jest.doMock('../../../../util/db.ts', () => ({
		getGameDocRef: () => mockFirestore.doc('games/game'),
	}));
});
beforeEach(cleanup);
beforeEach(jest.resetModules);
afterEach(mockFirestore.mocker.reset);

it('renders', () => {
	const { default: CluesContainer } = require('./Clues.component.container');
	const { asFragment } = render(
		<CluesContainer incrementUnreadNum={() => true} />
	);

	expect(asFragment()).toMatchSnapshot();
});

describe('incrementUnreadNum()', () => {
	it('calls incrementUnreadNum() on detective_clues change', () => {
		mockFirestore.mocker.loadDocument('games/game', {
			suspect_list: [1],
			detective_clues: {
				height: '175cm',
			},
		} as DB.GameDoc);
		const incrementUnreadNum = jest.fn().mockReturnValue(true);

		const { default: CluesContainer } = require('./Clues.component.container');
		render(<CluesContainer incrementUnreadNum={incrementUnreadNum} />);

		mockFirestore.doc('games/game').update({
			suspect_list: [1],
			detective_clues: {
				height: '175cm',
				'relationship status': 'married',
			},
		} as DB.GameDoc);

		expect(incrementUnreadNum).toBeCalledTimes(2);
	});

	it.skip('calls incrementUnreadNum() on suspect_list change', () => {
		mockFirestore.mocker.loadDocument('games/game', {
			suspect_list: [1],
		} as DB.GameDoc);
		const incrementUnreadNum = jest.fn().mockReturnValue(true);

		const { default: CluesContainer } = require('./Clues.component.container');
		render(<CluesContainer incrementUnreadNum={incrementUnreadNum} />);

		mockFirestore.doc('games/game').update({
			suspect_list: [2],
		} as DB.GameDoc);

		expect(incrementUnreadNum).toBeCalledTimes(2);
	});

	it("doesn't call incrementUnreadNum() on unrelated gameDoc change", () => {
		mockFirestore.mocker.loadDocument('games/game', {
			suspect_list: [1],
			chaser_sequence_num: 1,
			detective_clues: { gender: 'male' },
		} as DB.GameDoc);
		const incrementUnreadNum = jest.fn().mockReturnValue(true);

		const { default: CluesContainer } = require('./Clues.component.container');
		render(<CluesContainer incrementUnreadNum={incrementUnreadNum} />);

		mockFirestore.doc('games/game').update({
			suspect_list: [1],
			chaser_sequence_num: 2,
			detective_clues: { gender: 'male' },
		} as DB.GameDoc);

		expect(incrementUnreadNum).toBeCalledTimes(1);
	});
});
