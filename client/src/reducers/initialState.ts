export default {
	main: {
		gameId: null,
		isLoading: true,
		isAdmin: false,
	},
	map: {},
} as ReduxState;

export interface ReduxState {
	main: {
		gameId: string | null;
		isLoading: boolean;
		isAdmin: boolean;
	};
	map: {
		destination?: { longitude: number; latitude: number };
	};
}
