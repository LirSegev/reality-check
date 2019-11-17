/// <reference types="firebase" />
/// <reference types="jest-extended" />
/// <reference types="./util/db" />

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

declare type NonEmptyArray<T> = [T, ...T[]];
