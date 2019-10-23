import { createSlice, PayloadAction } from 'redux-starter-kit';
import initialState from './initialState';

export interface changeDestinationActionPayload {
	longitude: number;
	latitude: number;
}

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
	},
});

export const { changeDestination, removeDestination } = map.actions;
export default map.reducer;
