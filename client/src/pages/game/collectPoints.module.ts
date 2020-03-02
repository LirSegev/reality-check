import * as firebase from 'firebase/app';

import { db } from '../..';
import { addNotification } from '../../reducers/main.reducer';
import { getCurrentPlayer, getGameDocRef } from '../../util/db';
import { ActionType } from '../../util/db.types';
import { distanceBetweenPoints } from '../../util/general';
import { store } from './../..';

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

		for (const feature of points) {
			// prettier-ignore
			const distance = distanceBetweenPoints(myPos.coords, featureToCoord(feature));
			if (distance > MIN_DISTANCE) break;

			// prettier-ignore
			const collectedPointsStringified = sessionStorage.getItem('collected_points');
			const phase = sessionStorage.getItem('phase');
			if (collectedPointsStringified && typeof phase === 'string') {
				// prettier-ignore
				const collectedPoints = JSON.parse(collectedPointsStringified) as string[];
				if (
					(!feature!.properties!.phase || // For intelligence points
						feature!.properties!.phase <= Number(phase)) && // For detective points
					!collectedPoints.includes(feature!.properties!.id) //* Check point is not already collected
				) {
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
 * Add the id of a Geo\Json point to the collected points list in db.
 * @param newPoint GeoJson of the point to be collected
 */
async function collectPoint(newPoint: mapboxgl.MapboxGeoJSONFeature) {
	try {
		const pointType = await getCurrentPlayer().then(player =>
			player && player.role !== 'chaser' ? player.role : ''
		);
		const docRef = getGameDocRef();

		db.runTransaction(async transaction => {
			const game = await transaction.get(docRef).then(doc => doc.data());

			const prevPoints = game
				? (game[`collected_${pointType}_points`] as number[] | undefined)
				: undefined;

			const newPoints = prevPoints
				? [...prevPoints, newPoint.properties!.id as number]
				: [newPoint.properties!.id as number];

			transaction.update(docRef, {
				[`collected_${pointType}_points`]: newPoints,
			});
		}).then(() => {
			sendNotification(newPoint);
		});

		getClues(pointType, newPoint);
	} catch (err) {
		console.log(err);
	}
}

function getClues(pointType: string, point: mapboxgl.MapboxGeoJSONFeature) {
	try {
		const gameDocRef = getGameDocRef();
		switch (pointType) {
			case 'intelligence':
				onIntelligencePointCollected(gameDocRef, point);
				break;
			case 'detective':
				onDetectivePointCollected(gameDocRef, point);
		}
	} catch (err) {
		console.error(new Error('Getting clues'), err);
	}
}

function onDetectivePointCollected(
	gameDocRef: firebase.firestore.DocumentReference,
	point: mapboxgl.MapboxGeoJSONFeature
) {
	db.runTransaction(async transaction => {
		const game = await transaction
			.get(gameDocRef)
			.then(doc => doc.data() as DB.GameDoc | undefined);

		if (point.properties?.clue) {
			const detectiveClues =
				game && game['detective_clues']
					? {
							...game['detective_clues'],
							...JSON.parse(point.properties.clue),
					  }
					: JSON.parse(point.properties.clue);

			transaction.update(gameDocRef, {
				detective_clues: detectiveClues,
			});
		} else console.error(new Error("Point doesn't have 'clue' property"));
	});
}

// prettier-ignore
function onIntelligencePointCollected(gameDocRef: firebase.firestore.DocumentReference, point: mapboxgl.MapboxGeoJSONFeature) {
	if(point.properties?.route === 1)
		gameDocRef
			.collection('intel')
			.where('action.type', '==', 'walking' as ActionType)
			.get()
			.then(snap => {
				const numOfLocationReveals = snap.size;

				gameDocRef.update({
					chaser_sequence_num: numOfLocationReveals,
				});
			})
			.catch(err =>
				console.error(
					new Error("Getting intel items with action.type == 'walking'"),
					err
				)
			);
			else store.dispatch(addNotification({
				notification:{
					type: 'warning',
					header: "This CCTV doesn't have info on Mr. Z, try another one.",
					duration: 4,
				}
			}))
}

function sendNotification(point: mapboxgl.MapboxGeoJSONFeature) {
	store.dispatch(
		addNotification({
			notification: {
				type: 'success',
				header: 'Point collected',
			},
		})
	);
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
