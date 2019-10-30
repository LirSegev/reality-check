import { Notification } from './main.reducer';

export default {
	main: {
		gameId: null,
		isLoading: true,
		isAdmin: false,
		tabIndex: 2,
		opTabIndex: 0,
		notifications: [],
	},
	map: {
		mapOrientation: {
			center: { longitude: 14.42, latitude: 50.08 },
			bearing: 0,
			zoom: 12,
		},
	},
} as ReduxState;

export interface ReduxState {
	main: {
		gameId: string | null;
		isLoading: boolean;
		isAdmin: boolean;
		tabIndex: number;
		opTabIndex: number;
		notifications: Notification[];
	};
	map: {
		mapOrientation: MapOrientation;
		destination?: { longitude: number; latitude: number };
	};
}
