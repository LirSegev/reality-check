import * as firebase from 'firebase/app';
import { distanceBetweenPoints } from '../../util/general';
import { getCurrentPlayer } from '../../util/db';

/**
 * The min distance in meters the player needs to be from a point in order to collect it.
 */
const MIN_DISTANCE = 30;

export default function collectClosePoints(pos: Position) {
	const pointsStringified = sessionStorage.getItem('role_points');
	if (pointsStringified) {
		// prettier-ignore
		let points = JSON.parse(pointsStringified) as mapboxgl.MapboxGeoJSONFeature[];

		points = points.sort((p1, p2) => {
			const p1Dist = distanceBetweenPoints(pos.coords, featureToCoord(p1));
			const p2Dist = distanceBetweenPoints(pos.coords, featureToCoord(p2));

			return p1Dist - p2Dist;
		});

		let pointToCollect: mapboxgl.MapboxGeoJSONFeature | undefined;
		let tooFar = false;
		// prettier-ignore
		for (let key = 0; key < points.length && !pointToCollect && !tooFar; key++) {
			const feature = points[key];
			const distance = distanceBetweenPoints(
				pos.coords,
				featureToCoord(feature)
			);

			if (distance > MIN_DISTANCE) tooFar = true;
			else {
				const collectedPointsStringified = sessionStorage.getItem(
					'collected_points'
				);
				if (collectedPointsStringified && feature.properties && feature.properties.name) {
					const collectedPoints = JSON.parse(
						collectedPointsStringified
					) as string[];
					if (!collectedPoints.includes(feature.properties.name)) pointToCollect = feature;
				}
			}
		}

		if (pointToCollect) collectPoint(pointToCollect);
	}
}

function collectPoint(newPoint: mapboxgl.MapboxGeoJSONFeature) {
	getCurrentPlayer()
		.then(player => {
			if (player) {
				switch (player.role) {
					case 'detective':
						return 'identity';
					case 'intelligence':
						return 'intelligence';
				}
			}
		})
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
						if (prevPoints)
							return [...prevPoints, newPoint.properties!.name as string];
						else return [newPoint.properties!.name as string];
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

function featureToCoord(feature: mapboxgl.MapboxGeoJSONFeature) {
	return {
		accuracy: 5,
		// @ts-ignore
		latitude: feature.geometry.coordinates[1],
		// @ts-ignore
		longitude: feature.geometry.coordinates[0],
	} as Coordinates;
}
