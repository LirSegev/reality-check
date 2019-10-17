import { createSlice, PayloadAction } from 'redux-starter-kit';
import initialState from './initialState';

export interface changeGameActionPayload {
	gameId: string | null;
}

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
	},
});

export const { startLoading, stopLoading, changeGame } = main.actions;
export default main.reducer;
