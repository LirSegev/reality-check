export default {
	main: {
		isLogged: false,
		gameId: null,
		isLoading: true,
		isAdmin: false,
	},
} as ReduxState;

export interface ReduxState {
	main: {
		isLogged: boolean;
		gameId: string | null;
		isLoading: boolean;
		isAdmin: boolean;
	};
}
