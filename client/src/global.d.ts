/// <reference types="firebase" />

declare interface Player {
	displayName: string;
	role: PlayerRole;
	uid: string;
	location: {
		geopoint: firebase.firestore.GeoPoint;
		timestamp: firebase.firestore.Timestamp;
	} | null;
	messagingToken?: string;
	isDeleted?: boolean;
}

declare type PlayerRole = 'detective' | 'intelligence' | 'chaser';

declare interface ChatDoc {
	author: {
		displayName: string;
		uid: string;
	};
	message: string;
	timestamp: firebase.firestore.Timestamp;
}

declare interface MapOrientation {
	center: {
		latitude: number;
		longitude: number;
	};
	bearing: number;
	zoom: number;
	bounds?: {
		north: number;
		south: number;
		west: number;
		east: number;
	};
}

declare type UnreadType = 'chat' | 'intel' | 'target';

declare type ConnectedAction<T extends (...args: any[]) => any> = (
	...args: Parameters<T>
) => void;
