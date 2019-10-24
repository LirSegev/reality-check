export default {
	main: {
		gameId: null,
		isLoading: true,
		isAdmin: false,
		tabIndex: 2,
		opTabIndex: 0,
	},
	map: {},
} as ReduxState;

export interface ReduxState {
	main: {
		gameId: string | null;
		isLoading: boolean;
		isAdmin: boolean;
		tabIndex: number;
		opTabIndex: number;
	};
	map: {
		destination?: { longitude: number; latitude: number };
	};
}
