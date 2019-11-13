import { createSlice, PayloadAction } from 'redux-starter-kit';
import initialState from './initialState';
import { moveToLocationOnMap, changeTab } from './main.reducer';
import { moveToLocationOnMapPayload, changeTabPayload } from './main.reducer.d';
import {
	changeDestinationActionPayload,
	changeMapOrientationActionPayload,
	setPlayerLocationsPayload,
	setIsWaitingForLocationPayload,
} from './map.reducer.d';

const map = createSlice({
	name: 'map',
	initialState: initialState.map,
	reducers: {
		changeDestination(
			state,
			action: PayloadAction<changeDestinationActionPayload>
		) {
			const { latitude, longitude } = action.payload;
			state.destination = { latitude, longitude };
		},
		removeDestination(state) {
			state.destination = undefined;
		},
		changeMapOrientation(
			state,
			action: PayloadAction<changeMapOrientationActionPayload>
		) {
			const payload = action.payload;
			for (let key in payload) {
				// @ts-ignore
				state.mapOrientation[key] = payload[key];
			}
		},
		setPlayerLocations(
			state,
			action: PayloadAction<setPlayerLocationsPayload>
		) {
			state.playerLocations = action.payload.playerLocations;
		},
		toggleLegend(state) {
			state.isLegendOpen = !state.isLegendOpen;
		},
		setIsWaitingForLocation(
			state,
			action: PayloadAction<setIsWaitingForLocationPayload>
		) {
			state.isWaitingForLocation = action.payload;
		},
	},
	extraReducers: {
		[moveToLocationOnMap as any]: (
			state,
			action: PayloadAction<moveToLocationOnMapPayload>
		) => {
			const { lat, long, zoom } = action.payload;
			state.mapOrientation.center.latitude = lat;
			state.mapOrientation.center.longitude = long;
			if (zoom) state.mapOrientation.zoom = zoom;
		},
		[changeTab as any]: (state, action: PayloadAction<changeTabPayload>) => {
			state.isWaitingForLocation = false;
		},
	},
});

export const {
	changeDestination,
	removeDestination,
	changeMapOrientation,
	setPlayerLocations,
	toggleLegend,
	setIsWaitingForLocation,
} = map.actions;
export default map.reducer;
