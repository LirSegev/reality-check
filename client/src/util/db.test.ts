// @ts-ignore
import firebaseMock from 'firebase-mock';
import configureStore from 'redux-mock-store';

import { ReduxState } from './../reducers/initialState';

describe('getGameDocRef()', () => {
	const mockStore = configureStore();
	const mockFirestore = new firebaseMock.MockFirestore();
	const mockSDK = new firebaseMock.MockFirebaseSdk(
		null,
		null,
		() => {
			return mockFirestore;
		},
		null,
		null
	);

	beforeAll(() => {
		// Mock db
		jest.mock('firebase/app', () => mockSDK);
	});

	afterEach(() => {
		jest.resetModules();
	});

	it('returns correct reference', () => {
		const { getGameDocRef } = require('./db');

		// Mock redux store
		jest.mock('../index', () => ({
			store: mockStore({
				main: {
					gameId: 'someGameId',
				},
			} as ReduxState),
		}));

		expect(getGameDocRef()).toEqual(
			mockSDK.firestore().doc('games/someGameId')
		);
	});

	it('no gameId', () => {
		const { getGameDocRef } = require('./db');

		// Mock redux store
		jest.mock('../index', () => ({
			store: mockStore({
				main: {
					gameId: null,
				},
			} as ReduxState),
		}));

		expect(getGameDocRef).toThrow(Error);
	});
});
