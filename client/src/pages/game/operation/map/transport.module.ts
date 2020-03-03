import { MetroLine } from '../../intel/Intel.d';
import { getGameDocRef } from '../../../../util/db';
import {
	FeatureCollection,
	Geometry,
	GeoJsonProperties,
	Feature as GeoFeature,
} from 'geojson';

class Transport {
	constructor(public map: mapboxgl.Map) {
		this._listenToIntelItems(this._onNewIntelItems);
	}

	private _listenToIntelItems = (
		cb: (snapshot: firebase.firestore.QuerySnapshot) => void
	) => {
		getGameDocRef()
			.collection('intel')
			.orderBy('timestamp', 'desc')
			.onSnapshot(cb, err =>
				console.error(new Error('Error getting intel snapshot:'), err)
			);
	};

	private _onNewIntelItems = (snapshot: firebase.firestore.QuerySnapshot) => {};

	public show = (type: 'tram' | 'metro', line: number | string) => {
		switch (type) {
			case 'tram':
				this.map.setFilter('transport-routes', ['has', `L_TRAM[${line}]`]);
				break;

			case 'metro':
				let mLine: string;
				switch (line) {
					case MetroLine.A:
						mLine = 'METRO A';
						break;
					case MetroLine.B:
						mLine = 'METRO B';
						break;
					case MetroLine.C:
						mLine = 'METRO C';
						break;
					default:
						mLine = '*';
				}
				this.map.setFilter('transport-routes', [
					'==',
					['get', 'L_METRO'],
					mLine,
				]);
				break;
		}
	};
}
