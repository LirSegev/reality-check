import { firestore } from 'firebase';

export interface IntelItem {
	action: {
		type: ActionType;
		more: number | MetroLine | string;
	};
	timestamp: firestore.Timestamp;
}

type ActionType = 'tram' | 'metro' | 'bus' | 'walking';

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
