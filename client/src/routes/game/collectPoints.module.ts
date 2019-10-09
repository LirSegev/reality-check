import * as firebase from 'firebase/app';
import { distanceBetweenPoints } from '../../util/general';
import { getCurrentPlayer } from '../../util/db';

/**
 * The min distance in meters the player needs to be from a point in order to collect it.
 */
const MIN_DISTANCE = 30;

/**
 * Collect the closest point to a given Position if it is close enough to be collected.
 */
export default function collectClosePoints(myPos: Position) {
	const pointsStringified = sessionStorage.getItem('role_points');
	if (pointsStringified) {
		// prettier-ignore
		let points = JSON.parse(pointsStringified) as mapboxgl.MapboxGeoJSONFeature[];
		points = sortPoints(myPos, points);

		for (let key = 0; key < points.length; key++) {
			const feature = points[key];
			// prettier-ignore
			const distance = distanceBetweenPoints(myPos.coords, featureToCoord(feature));
			if (distance > MIN_DISTANCE) break;

			// prettier-ignore
			const collectedPointsStringified = sessionStorage.getItem('collected_points');
			if (collectedPointsStringified) {
				// prettier-ignore
				const collectedPoints = JSON.parse(collectedPointsStringified) as string[];
				// Check if point has already been collected
				if (!collectedPoints.includes(feature!.properties!.name)) {
					collectPoint(feature);
					break;
				}
			}
		}
	}
}

/**
 * Sort a list of GeoJson features based on their distance from a Position.
 */
function sortPoints(pos: Position, points: mapboxgl.MapboxGeoJSONFeature[]) {
	return points.sort((p1, p2) => {
		const p1Dist = distanceBetweenPoints(pos.coords, featureToCoord(p1));
		const p2Dist = distanceBetweenPoints(pos.coords, featureToCoord(p2));

		return p1Dist - p2Dist;
	});
}

/**
 * Add the name of a Geo\Json point to the collected points list in db.
 * @param newPoint GeoJson of the point to be collected
 */
function collectPoint(newPoint: mapboxgl.MapboxGeoJSONFeature) {
	getCurrentPlayer()
		.then(player => getPointType(player!))
		.then(pointType => {
			const gameId = localStorage.getItem('gameId');
			if (gameId) {
				const docRef = firebase.firestore().doc(`games/${gameId}`);
				let gameDoc: {} | undefined;

				docRef
					.get()
					.then(doc => doc.data())
					.then(game => {
						gameDoc = game;
						if (game)
							return game[`collected_${pointType}_points`] as
								| string[]
								| undefined;
					})
					.then(prevPoints => {
						let points;

						if (prevPoints)
							points = [...prevPoints, newPoint.properties!.name as string];
						else points = [newPoint.properties!.name as string];

						return points;
					})
					.then(newPoints => {
						docRef
							.set({
								...gameDoc,
								[`collected_${pointType}_points`]: newPoints,
							})
							.catch(err =>
								console.error(new Error('Updating collected points list'), err)
							);
					})
					.catch(err =>
						console.error(new Error('Getting collected points'), err)
					);
			} else console.error(new Error('No gameId in localStorage'));
		})
		.catch(err => console.error(new Error('Getting current player'), err));
}

/**
 * Get point type based on player's role.
 */
function getPointType(player: Player) {
	let pointType = '';
	switch (player.role) {
		case 'detective':
			pointType = 'identity';
			break;
		case 'intelligence':
			pointType = 'intelligence';
	}

	return pointType;
}

/**
 * Takes GeoJsonFeature and returns Coordinates.
 */
function featureToCoord(feature: mapboxgl.MapboxGeoJSONFeature) {
	return {
		accuracy: 5,
		// @ts-ignore
		latitude: feature.geometry.coordinates[1],
		// @ts-ignore
		longitude: feature.geometry.coordinates[0],
	} as Coordinates;
}
