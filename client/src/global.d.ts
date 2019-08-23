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
	zoom: number;
}
