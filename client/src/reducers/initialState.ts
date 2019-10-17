export default {
	main: {
		gameId: null,
		isLoading: true,
		isAdmin: false,
	},
} as ReduxState;

export interface ReduxState {
	main: {
		gameId: string | null;
		isLoading: boolean;
		isAdmin: boolean;
	};
}
