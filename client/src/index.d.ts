import { firestore } from 'firebase';

export interface Player {
	displayName: string;
	location: {
		geopoint: firestore.GeoPoint;
		timestamp: firestore.Timestamp;
	};
	uid: string;
}

export interface MapOrientation {
	center: {
		latitude: number;
		longitude: number;
	};
	zoom: number;
}
