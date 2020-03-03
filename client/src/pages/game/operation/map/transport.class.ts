import { getGameDocRef } from '../../../../util/db';
import { MetroLine } from '../../intel/Intel.d';
import { IntelItem } from '../../../../util/db.types';

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
	public hide = () => {
		this.show('metro', 0);
	};

	/**
	 * Show specific transport line
	 *
	 * @memberof Transport
	 */
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

export default Transport;
