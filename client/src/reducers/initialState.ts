import { Notification } from './main.reducer.d';
import { PlayerLocations } from './map.reducer.d';

export default {
	main: {
		gameId: null,
		isLoading: true,
		isAdmin: false,
		tabIndex: 2,
		notifications: [],
	},
	map: {
		mapOrientation: {
			center: { longitude: 14.42, latitude: 50.08 },
			bearing: 0,
			zoom: 12,
		},
		playerLocations: {},
		isLegendOpen: false,
		isWaitingForLocation: false,
	},
} as ReduxState;

export interface ReduxState {
	main: {
		gameId: string | null;
		isLoading: boolean;
		isAdmin: boolean;
		tabIndex: number;
		notifications: Notification[];
	};
	map: {
		mapOrientation: MapOrientation;
		destination?: { longitude: number; latitude: number };
		playerLocations: PlayerLocations;
		isLegendOpen: boolean;
		isWaitingForLocation: boolean;
	};
}
