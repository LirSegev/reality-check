import { createSlice, PayloadAction } from 'redux-starter-kit';
import initialState from './initialState';
import { moveToLocationOnMap } from './main.reducer';
import { moveToLocationOnMapPayload } from './main.reducer.d';
import {
	changeDestinationActionPayload,
	changeMapOrientationActionPayload,
	setPlayerLocationsPayload,
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
	},
});

export const {
	changeDestination,
	removeDestination,
	changeMapOrientation,
	setPlayerLocations,
	toggleLegend,
} = map.actions;
export default map.reducer;
