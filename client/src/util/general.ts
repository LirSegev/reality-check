export function isIOS() {
	return !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
}

/**
 * Returns the distance in meters between two points
 */
export function distanceBetweenPoints(p1: Coordinates, p2: Coordinates) {
	return (
		getDistanceFromLatLonInKm(
			p1.latitude,
			p1.longitude,
			p2.latitude,
			p2.longitude
		) * 1000
	);
}

export function bearingBetweenPoints(start: Coordinates, end: Coordinates) {
	return bearing(start.latitude, start.longitude, end.latitude, end.longitude);
}

/**
 * @author Chuck
 * @link https://stackoverflow.com/a/27943
 */
function getDistanceFromLatLonInKm(
	lat1: number,
	lon1: number,
	lat2: number,
	lon2: number
) {
	var R = 6371; // Radius of the earth in km
	var dLat = deg2rad(lat2 - lat1); // deg2rad below
	var dLon = deg2rad(lon2 - lon1);
	var a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(deg2rad(lat1)) *
			Math.cos(deg2rad(lat2)) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var d = R * c; // Distance in km
	return d;
}

/**
 * @author Chuck
 * @link https://stackoverflow.com/a/27943
 */
export function deg2rad(deg: number) {
	return deg * (Math.PI / 180);
}

/**
 * @author Andrey Bulgakov
 * @link https://stackoverflow.com/a/52079217
 */
export function rad2deg(rad: number) {
	return (rad * 180) / Math.PI;
}

/**
 * @author Andrey Bulgakov
 * @link https://stackoverflow.com/a/52079217
 */
function bearing(
	startLat: number,
	startLng: number,
	destLat: number,
	destLng: number
) {
	startLat = deg2rad(startLat);
	startLng = deg2rad(startLng);
	destLat = deg2rad(destLat);
	destLng = deg2rad(destLng);

	let y = Math.sin(destLng - startLng) * Math.cos(destLat);
	let x =
		Math.cos(startLat) * Math.sin(destLat) -
		Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
	let brng = Math.atan2(y, x);
	brng = rad2deg(brng);
	return (brng + 360) % 360;
}
