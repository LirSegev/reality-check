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

/**
 * @deprecated
 */
export function addTransportRoutesLayer(map: mapboxgl.Map) {
	const geoJsonUrl =
		'http://opendata.iprpraha.cz/CUR/DOP/DOP_PID_TRASY_L/WGS_84/DOP_PID_TRASY_L.json';

	fetch(geoJsonUrl)
		.then(res => res.json())
		.then(tramListStringToArray)
		.then(data => {
			map.addLayer({
				id: 'transport-routes',
				source: {
					type: 'geojson',
					data,
				},
				paint: {
					'line-color': '#50a882',
					'line-width': 10,
				},
				// Filter out all features
				filter: ['==', '1', '2'],
				type: 'line',
			});
		})
		.catch(err =>
			console.error(
				new Error('Error adding transport-routes layer to map:'),
				err
			)
		);
}

/**
 * @deprecated used only in addTransportRoutesLayer()
 */
function tramListStringToArray(res: any) {
	if (res.features)
		return {
			...res,
			features: (res as FeatureCollection).features.map(feature => {
				let result: GeoFeature<Geometry, GeoJsonProperties> = {
					...feature,
				};
				const tramList = feature.properties!['L_TRAM'] as string | null;
				if (tramList) {
					result.properties!['L_TRAM'] = {};
					tramList
						.split(', ')
						.forEach(
							tramNum =>
								(result.properties!['L_TRAM'][tramNum] = Number(tramNum))
						);
				} else if (tramList == null) {
					result.properties!['L_TRAM'] = {};
				}
				return result;
			}),
		} as FeatureCollection<Geometry, GeoJsonProperties>;
}
