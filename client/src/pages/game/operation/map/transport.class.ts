import { getGameDocRef } from '../../../../util/db';
import { MetroLine } from '../../intel/Intel.d';
import { IntelItem } from '../../../../util/db.types';
import { multiLineString } from '@turf/helpers';
// @ts-ignore
import dissolve from 'geojson-dissolve';

class Transport {
	transportLayerName = 'transport-routes';

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

	private _onNewIntelItems = (snapshot: firebase.firestore.QuerySnapshot) => {
		if (!snapshot.empty) {
			const lastIntel = (snapshot.docs[0].data() as IntelItem).action;

			switch (lastIntel.type) {
				case 'metro':
				case 'tram':
					this.show(lastIntel.type, lastIntel.text);
					break;
				default:
					this.hide();
					break;
			}
		}
	};

	/**
	 * Hide all transport
	 *
	 * @memberof Transport
	 */
	hide = () => {
		this.show('metro', 0);
	};

	/**
	 * Show specific transport line
	 *
	 * @memberof Transport
	 */
	show = (type: 'tram' | 'metro', line: number | string) => {
		this.map.setFilter(this.transportLayerName, this._createFilter(type, line));
	};

	/**
	 * Returns a mapbox filter based on transport type and line
	 *
	 * @private
	 * @memberof Transport
	 */
	private _createFilter = (
		type: 'tram' | 'metro',
		line: number | string
	): unknown[] => {
		switch (type) {
			case 'tram':
				return ['has', `L_TRAM[${line}]`];

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
				return ['==', ['get', 'L_METRO'], mLine];
		}
	};

	getLine = (
		type: 'tram' | 'metro',
		line: number | string
	): GeoJSON.Feature<GeoJSON.MultiLineString> => {
		const { source, sourceLayer } = this.map.getLayer(
			this.transportLayerName
		) as Omit<mapboxgl.Layer, 'source-layer'> & { sourceLayer: string };

		const features = this.map.querySourceFeatures(source as string, {
			sourceLayer,
			filter: this._createFilter(type, line),
		});

		let dissolved = dissolve(features) as
			| GeoJSON.MultiLineString
			| GeoJSON.LineString;
		let counter = 1;

		while (counter < 5 && dissolved.type !== 'LineString') {
			const newDissolved = dissolve(dissolved);
			if (JSON.stringify(dissolved) === JSON.stringify(newDissolved)) break;
			dissolved = newDissolved;
			counter++;
		}

		if (dissolved.type === 'LineString')
			return multiLineString([dissolved.coordinates]);
		return multiLineString(dissolved.coordinates);
	};
}

export default Transport;
