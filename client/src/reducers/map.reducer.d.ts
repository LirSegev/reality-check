export interface changeDestinationActionPayload {
	longitude: number;
	latitude: number;
}
export type changeMapOrientationActionPayload = Partial<MapOrientation>;

export interface PlayerLocation {
	playerName: string;
	longitude: number;
	latitude: number;
	timestamp: number;
}

export interface PlayerLocations {
	[uid: string]: PlayerLocation;
}

export interface setPlayerLocationsPayload {
	playerLocations: PlayerLocations;
}
