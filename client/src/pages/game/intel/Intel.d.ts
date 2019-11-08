import { firestore } from 'firebase';

export interface IntelItem {
	action: IntelItemAction_tramBusMetro | IntelItemAction_walking;
	timestamp: firestore.Timestamp;
}

type ActionType = 'tram' | 'metro' | 'bus' | 'walking';

interface IntelItemAction {
	type: ActionType;
	text: string;
}
interface IntelItemAction_tramBusMetro extends IntelItemAction {
	type: 'tram' | 'bus' | 'metro';
}
interface IntelItemAction_walking extends IntelItemAction {
	type: 'walking';
	coordinates?: firestore.GeoPoint;
}

export enum MetroLine {
	A = 'green line',
	B = 'yellow line',
	C = 'red line',
}

const iconsSize = 40;
const iconsColor = '000000';
export enum Icons {
	tram = `https://img.icons8.com/color/${iconsSize}/${iconsColor}/tram.png`,
	metro = `https://img.icons8.com/color/${iconsSize}/${iconsColor}/subway.png`,
	walking = `https://img.icons8.com/color/${iconsSize}/${iconsColor}/walking.png`,
	bus = `https://img.icons8.com/color/${iconsSize}/${iconsColor}/bus.png`,
}
