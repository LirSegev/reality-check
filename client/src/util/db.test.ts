import { app as firebaseApp } from '../mocks/firebase';
import firebase from 'firebase';
import { exposeMockFirebaseApp } from 'ts-mock-firebase';
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

describe('getCurrentPlayerRef()', () => {
	const mockAuth = new firebaseMock.MockAuthentication();
	const mockFirestore = exposeMockFirebaseApp(firebaseApp).firestore();
	const mockSDK: {
		auth: () => typeof mockAuth;
		firestore: () => typeof mockFirestore;
	} = new firebaseMock.MockFirebaseSdk(
		null,
		() => mockAuth,
		() => mockFirestore,
		null,
		null
	);

	beforeAll(() => {
		// Mock db
		jest.mock('firebase/app', () => mockSDK);
		jest.mock('../index', () => {});
	});
	afterAll(() => {
		jest.resetModules();
	});
	afterEach(() => {
		mockSDK.firestore().mocker.reset();
	});

	it('returns correct reference', () => {
		const { getCurrentPlayerRef } = require('./db');
		const getGameDocRefMock = jest
			.fn()
			.mockReturnValue(mockSDK.firestore().doc('games/id'));
		mockSDK.auth().changeAuthState({
			uid: 'testUid',
		});
		mockSDK.auth().flush();

		mockSDK.firestore().mocker.loadCollection('games/id/players', {
			someId: { uid: 'testUid' },
			otherId: { uid: 'otherTestUid' },
		});

		expect.assertions(1);
		expect(getCurrentPlayerRef(getGameDocRefMock)).resolves.toEqual(
			mockSDK.firestore().doc('games/id/players/someId')
		);
	});

	it('no player found', () => {
		const { getCurrentPlayerRef } = require('./db');
		const getGameDocRefMock = jest
			.fn()
			.mockReturnValue(mockSDK.firestore().doc('games/id'));
		mockSDK.auth().changeAuthState({
			uid: 'randomId',
		});
		mockSDK.auth().flush();

		mockSDK.firestore().mocker.loadCollection('games/id/players', {
			someId: { uid: 'testUid' },
			otherId: { uid: 'otherTestUid' },
		});

		expect.assertions(1);
		expect(getCurrentPlayerRef(getGameDocRefMock)).rejects.toBeInstanceOf(
			Error
		);
	});
});
