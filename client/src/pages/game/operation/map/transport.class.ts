import { getGameDocRef } from '../../../../util/db';
import { MetroLine } from '../../intel/Intel.d';
import { IntelItem } from '../../../../util/db.types';
import { multiLineString } from '@turf/helpers';
import pointToPointDist from '@turf/distance';
import { lineString } from '@turf/helpers';
import lineSlice from '@turf/line-slice';
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

	routeOnLine = (
		start: [number, number],
		end: [number, number],
		line: GeoJSON.Feature<GeoJSON.LineString | GeoJSON.MultiLineString>,
		options?: {
			/**
			 * Max time, in milliseconds, to calculate route. Defaults to 200
			 */
			maxTime: number;
		}
	): GeoJSON.Feature<GeoJSON.LineString> => {
		const result: [number, number][] = [];
		if (line.geometry.type === 'LineString')
			// prettier-ignore
			return lineSlice(start, end, line as GeoJSON.Feature<GeoJSON.LineString>) as GeoJSON.Feature<GeoJSON.LineString>;

		/**
		 * Max time to calculate route in milliseconds
		 */
		const MAX_TIME = options?.maxTime ?? 200;
		const startTime = Date.now();
		while (Date.now() - startTime <= MAX_TIME) {
			const prevCoords = result.length > 0 ? result[result.length - 1] : start;
			const nextCoords = end;

			const lines = line.geometry.coordinates
				.map(coords => {
					let slice = lineSlice(prevCoords, nextCoords, lineString(coords));

					const sliceCoords = slice.geometry!.coordinates;
					const distFromPrev = pointToPointDist(prevCoords, nextCoords);
					const distFromStart = pointToPointDist(sliceCoords[0], nextCoords);
					const distFromEnd = pointToPointDist(
						sliceCoords[sliceCoords.length - 1],
						nextCoords
					);

					if (distFromStart < distFromEnd && slice.geometry)
						slice.geometry.coordinates = slice.geometry.coordinates.reverse();

					return {
						line: slice,
						distChange: distFromPrev - Math.min(distFromEnd, distFromStart),
						distFromPrev: pointToPointDist(
							prevCoords,
							slice.geometry!.coordinates[0]
						),
					};
				})
				// Sort from closest to prev to farthest from prev
				.sort((a, b) => a.distFromPrev - b.distFromPrev);

			/**
			 * Closest line which gets us closer to target
			 */
			const slice = lines.find(line => line.distChange > 0)?.line;
			// No line will get us closer to target
			if (!slice) break;

			const coords =
				(slice?.geometry?.coordinates as [number, number][] | undefined) ?? [];

			result.push(...coords);
		}

		return lineString(result);
	};
}

export default Transport;
