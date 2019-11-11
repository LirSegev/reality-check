import firebase from 'firebase';
import configureStore from 'redux-mock-store';
// @ts-ignore
import firebaseMock from 'firebase-mock';

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

describe('dateToTimestamp()', () => {
	beforeAll(() => {
		jest.mock('firebase/app', () => require('firebase'));
		jest.mock('../index');
	});
	afterAll(() => {
		jest.resetModules();
	});

	it('returns correct timestamp', () => {
		const { dateToTimestamp } = require('./db');
		expect(dateToTimestamp(new Date('4 May 2000 10:32:12'))).toEqual(
			new firebase.firestore.Timestamp(957429132, 0)
		);
	});
});
