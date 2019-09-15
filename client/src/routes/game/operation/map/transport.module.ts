import { MetroLine } from '../../intel/Intel.d';
import {
	FeatureCollection,
	Geometry,
	GeoJsonProperties,
	Feature as GeoFeature,
} from 'geojson';

export const onShowTransportOnMapWrapper = (map: mapboxgl.Map) => (
	e: Event
) => {
	const { type, line } = (e as CustomEvent<{
		type: 'tram' | 'metro';
		line: number | string;
	}>).detail;

	switch (type) {
		case 'tram':
			map.setFilter('transport-routes', [
				'has',
				String(line),
				['get', 'L_TRAM'],
			]);
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
			map.setFilter('transport-routes', ['==', ['get', 'L_METRO'], mLine]);
			break;
	}
};

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
