import { cleanup, render } from '@testing-library/react';
import React from 'react';
import configureStore from 'redux-mock-store';
import {
	exposeMockFirebaseApp,
	MockGeoPoint,
	MockTimestamp,
} from 'ts-mock-firebase';
import waitForExpect from 'wait-for-expect';

import { app as firebaseApp } from '../../../../mocks/firebase';
import { ReduxState } from '../../../../reducers/initialState';
import { IntelItem, Player } from '../../../../util/db.types';
import { generateWithStore } from '../../../../util/testHelpers';
import MapTabContainerImport from './Map.tab.container';

const mockStore = configureStore<ReduxState>();
// const baseState: ReduxState = {};
const withState = generateWithStore(mockStore);

const mockFirestore = exposeMockFirebaseApp(firebaseApp).firestore();

// Mock modules
beforeAll(() => {
	jest.mock('firebase/app');
	jest.mock('mapbox-gl', () => ({
		NavigationControl: jest.fn(),
	}));
	jest.mock('./Map.tab.view.tsx', () => jest.fn().mockReturnValue(<div />));
	jest.mock('../../../../util/customEvents/factories.ts', () => ({
		createLocationselectEvent: jest.fn(),
	}));
	jest.mock('../../../../util/db', () => ({
		getCurrentPlayer: jest
			.fn()
			.mockReturnValue(mockFirestore.doc('games/game/players/currPlayer')),
		getGameDocRef: jest.fn().mockReturnValue(mockFirestore.doc('games/game')),
	}));
	jest.mock('../../../../util/general', () => ({
		isIOS: jest.fn(),
	}));
	jest.mock('./controls/geolocateControl.module.ts', () => ({
		addGeolocateControl: jest.fn(),
	}));
	jest.mock('./controls/phaseSelectControl.ts', () => jest.fn());
	jest.mock('./controls/roleSelectControl.module.ts', () => jest.fn());
	jest.mock('./Legend/legendControl.ts', () => jest.fn());
	jest.mock('./transport.module.ts', () => ({
		onShowTransportOnMapWrapper: jest.fn(),
	}));
});
afterEach(cleanup);
// Set up firestore mock
beforeEach(() => {
	mockFirestore.mocker.loadDocument('games/game', {
		suspect_list: [1],
	} as DB.GameDoc);
	mockFirestore.mocker.loadDocument('games/game/players/currPlayer', {
		displayName: 'lir',
		location: null,
		role: 'chaser',
		uid: 'someUID',
	} as Player);
	mockFirestore.mocker.loadCollection('games/game/intel', {
		1: {
			action: {
				type: 'walking',
				text: 'some street',
				coordinates: new MockGeoPoint(14, 15),
			},
			timestamp: new MockTimestamp(1, 0),
		},
		2: {
			action: {
				type: 'tram',
				text: 12,
			},
			timestamp: new MockTimestamp(2, 0),
		},
	} as { [id: string]: IntelItem });
});
afterEach(mockFirestore.mocker.reset);

it('renders', done => {
	jest.isolateModules(async () => {
		const MapTabContainer = require('./Map.tab.container')
			.default as typeof MapTabContainerImport;
		const { el: MapTabContainerWithState } = withState(MapTabContainer, {});
		const { asFragment } = render(
			<MapTabContainerWithState onMove={() => {}} />
		);

		expect(asFragment()).toMatchSnapshot();

		mockFirestore.collection('games/game/intel').add({
			action: {
				type: 'walking',
				text: 'seen near prague',
				coordinates: new MockGeoPoint(20, 21),
			},
			timestamp: new MockTimestamp(3, 0),
		} as IntelItem);

		const MapTabView = require('./Map.tab.view');
		await waitForExpect(() => {
			expect(MapTabView).toHaveBeenCalledWith(
				expect.objectContaining({
					mrZRoute: [
						[15, 14],
						[21, 20],
					],
				}),
				{}
			);
		});
		done();
	});
});
