import { createSlice, PayloadAction } from 'redux-starter-kit';
import initialState from './initialState';

export interface changeGameActionPayload {
	gameId: string | null;
}
export interface moveToLocationOnMapPayload {
	long: number;
	lat: number;
	zoom?: number;
}
export type changeTabPayload = number;
export type changeOpTabPayload = number;

const main = createSlice({
	name: 'main',
	initialState: initialState.main,
	reducers: {
		stopLoading(state) {
			state.isLoading = false;
		},
		startLoading(state) {
			state.isLoading = true;
		},
		changeGame(state, action: PayloadAction<changeGameActionPayload>) {
			state.gameId = action.payload.gameId;
		},
		adminSignin(state) {
			state.isAdmin = true;
		},
		signOut(state) {
			state.isAdmin = initialState.main.isAdmin;
			state.gameId = initialState.main.gameId;
		},
		goToMapTab(state) {
			state.tabIndex = 2;
			state.opTabIndex = 0;
		},
		moveToLocationOnMap(
			state,
			action: PayloadAction<moveToLocationOnMapPayload>
		) {
			state.tabIndex = 2;
			state.opTabIndex = 0;
		},
		changeTab(state, action: PayloadAction<changeTabPayload>) {
			state.tabIndex = action.payload;
		},
		changeOpTab(state, action: PayloadAction<changeOpTabPayload>) {
			state.opTabIndex = action.payload;
		},
	},
});

export const {
	startLoading,
	stopLoading,
	changeGame,
	adminSignin,
	signOut,
	changeOpTab,
	changeTab,
	goToMapTab,
	moveToLocationOnMap,
} = main.actions;
export default main.reducer;
