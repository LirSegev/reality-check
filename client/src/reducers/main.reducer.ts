import { createSlice } from 'redux-starter-kit';
import initialState, { ReduxState } from './initialState';

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
	},
});

export const { startLoading, stopLoading } = main.actions;
export default main.reducer;
