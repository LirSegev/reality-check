import { GeolocateControl, EventData } from 'mapbox-gl';
import { isIOS } from '../../../../util/general';

const onDeviceorientationWrapper = (map: mapboxgl.Map) => (
	e: DeviceOrientationEvent
) => {
	// prettier-ignore
	const bearing = isIOS()
	// @ts-ignore
		?  Math.round(e.webkitCompassHeading as number)
		: e.alpha
			? Math.round(360 - e.alpha)
			: null;

	if (bearing) updateBearing(map, bearing);
};

function updateBearing(map: mapboxgl.Map, bearing: number) {
	if (!map.isEasing())
		map.setBearing(bearing, { geolocateSource: true } as EventData);
}

export function addGeolocateControl(map: mapboxgl.Map) {
	const onDeviceorientation = onDeviceorientationWrapper(map);
	const geolocateControl = new GeolocateControl({
		positionOptions: {
			enableHighAccuracy: true,
		},
		trackUserLocation: true,
	});

	// Add event listeners for device bearing
	geolocateControl.on('trackuserlocationstart', () => {
		if (isIOS())
			window.addEventListener('deviceorientation', onDeviceorientation);
		else
			window.addEventListener('deviceorientationabsolute', onDeviceorientation);
	});

	// Remove event listeners for device bearing
	geolocateControl.on('trackuserlocationend', () => {
		if (isIOS())
			window.removeEventListener('deviceorientation', onDeviceorientation);
		else
			window.removeEventListener(
				'deviceorientationabsolute',
				onDeviceorientation
			);

		// Reset bearing
		map.rotateTo(0, { geolocateSource: true } as EventData);
	});

	map.addControl(geolocateControl);
}
