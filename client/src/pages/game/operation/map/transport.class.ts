import { getGameDocRef } from '../../../../util/db';
import { MetroLine } from '../../intel/Intel.d';
import { IntelItem } from '../../../../util/db.types';

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
}

export default Transport;
