import * as firebase from 'firebase/app';
import { distanceBetweenPoints } from '../../util/general';
import { getCurrentPlayer, getGameDocRef } from '../../util/db';
import { store } from './../../index';
import { addNotification } from '../../reducers/main.reducer';

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
			const phase = sessionStorage.getItem('phase');
			if (collectedPointsStringified && typeof phase === 'string') {
				// prettier-ignore
				const collectedPoints = JSON.parse(collectedPointsStringified) as string[];
				// Check if point has already been collected
				if (
					(!feature!.properties!.phase || // For intelligence points
						feature!.properties!.phase <= Number(phase)) && // For detective points
					!collectedPoints.includes(feature!.properties!.id) // Check point is not already collected
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
function collectPoint(newPoint: mapboxgl.MapboxGeoJSONFeature) {
	getCurrentPlayer()
		.then(player => (player && player.role !== 'chaser' ? player.role : ''))
		.then(pointType => {
			try {
				const docRef = getGameDocRef();
				let gameDoc: {} | undefined;

				docRef
					.get()
					.then(doc => doc.data())
					.then(game => {
						gameDoc = game;
						if (game)
							return game[`collected_${pointType}_points`] as
								| number[]
								| undefined;
					})
					.then(prevPoints => {
						let points;

						if (prevPoints)
							points = [...prevPoints, newPoint.properties!.id as number];
						else points = [newPoint.properties!.id as number];

						return points;
					})
					.then(newPoints => {
						docRef
							.set({
								...gameDoc,
								[`collected_${pointType}_points`]: newPoints,
							})
							.then(() => {
								getClues(pointType, newPoint);
								sendNotification(newPoint);
							})
							.catch(err =>
								console.error(new Error('Updating collected points list'), err)
							);
					})
					.catch(err =>
						console.error(new Error('Getting collected points'), err)
					);
			} catch (err) {
				console.error(new Error('Collecting point'), err);
			}
		})
		.catch(err => console.error(new Error('Getting current player'), err));
}

function getClues(pointType: string, point: mapboxgl.MapboxGeoJSONFeature) {
	try {
		const gameDocRef = getGameDocRef();
		switch (pointType) {
			case 'intelligence':
				onIntelligencePointCollected(gameDocRef);
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
	gameDocRef
		.get()
		.then(doc => doc.data())
		.then(game => {
			let detectiveClues = {};
			if (point.properties && point.properties.clue)
				detectiveClues =
					game && game['detective_clues']
						? {
								...game['detective_clues'],
								...JSON.parse(point.properties.clue),
						  }
						: JSON.parse(point.properties.clue);
			else console.error(new Error("Point doesn't have 'clue' property"));

			gameDocRef.set({
				...game,
				detective_clues: detectiveClues,
			});
		})
		.catch(err => console.error(new Error('Getting game doc'), err));
}

// prettier-ignore
function onIntelligencePointCollected(gameDocRef: firebase.firestore.DocumentReference) {
	gameDocRef
		.collection('intel')
		.where('action.type', '==', 'walking' as DB.Game.Intel.ActionType)
		.get()
		.then(snap => {
			const numOfLocationReveals = snap.size;

			gameDocRef
				.get()
				.then(doc => doc.data())
				.then(game => {
					// TODO: Use update() not set()
					gameDocRef.set({
						...game,
						chaser_sequence_num: numOfLocationReveals,
					});
				})
				.catch(err => console.error(new Error('Getting game doc'), err));
		})
		.catch(err =>
			console.error(
				new Error("Getting intel items with action.type == 'walking'"),
				err
			)
		);
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
