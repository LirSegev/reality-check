/// <reference types="firebase" />

declare interface Player {
	displayName: string;
	location: {
		geopoint: firebase.firestore.GeoPoint;
		timestamp: firebase.firestore.Timestamp;
	};
	messagingToken?: string;
	uid: string;
}

declare interface MapOrientation {
	center: {
		latitude: number;
		longitude: number;
	};
	zoom: number;
}
