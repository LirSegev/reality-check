import * as firebase from 'firebase/app';
import { store } from '../index';
import * as t from 'io-ts';
import { either } from 'fp-ts/es6/Either';

/**
 * Updates the data of the current player in the database.
 * @param data An object containing the fields and values with which to update the document. Fields can contain dots to reference nested fields within the document.
 * @returns A Promise resolved once the data has been successfully written to the backend (Note that it won't resolve while you're offline).
 */
export async function updateCurrentPlayer(
	data: firebase.firestore.UpdateData
): Promise<void> {
	try {
		(await getCurrentPlayerRef()).update(data);
	} catch (err) {
		console.error(err);
		throw new Error('Error updating current user');
	}
}

/**
 * Gets the data of the current player from the database.
 */
export async function getCurrentPlayer(): Promise<
	DB.Game.Players.Player | undefined
> {
	try {
		const ref = await getCurrentPlayerRef();
		const doc = await ref.get();
		return doc.data() as DB.Game.Players.Player | undefined;
	} catch (err) {
		console.error(err);
		throw new Error('Error getting current user');
	}
}

export function getCurrentPlayerRef(
	_getGameDocRef: typeof getGameDocRef = getGameDocRef
): Promise<firebase.firestore.DocumentReference> {
	return new Promise((resolve, reject) => {
		_getGameDocRef()
			.collection('players')
			.where('uid', '==', firebase.auth().currentUser!.uid)
			.get()
			.then(playerList => {
				if (playerList.size > 1) throw new Error('More than one user found');
				else if (playerList.size === 1) {
					resolve(playerList.docs[0].ref);
				} else {
					throw new Error('No users found');
				}
			})
			.catch(err => {
				console.error(err);
				reject(new Error('Getting current user DocumentReference'));
			});
	});
}

export function getGameDocRef(): firebase.firestore.DocumentReference {
	const db = firebase.firestore();
	const gameId = store.getState().main.gameId;
	if (!gameId)
		throw new Error('Could not get gameDocRef because gameId is not set');

	return db.doc(`games/${gameId}`);
}
const FirebaseTimestamp = new t.Type<
	firebase.firestore.Timestamp,
	Date,
	unknown
>(
	'FirebaseTimestamp',
	(u): u is firebase.firestore.Timestamp =>
		u instanceof firebase.firestore.Timestamp,
	function(this: t.Type<firebase.firestore.Timestamp, Date, unknown>, u, c) {
		return this.is(u)
			? t.success(u)
			: u instanceof Date
			? t.success(firebase.firestore.Timestamp.fromDate(u))
			: either.chain(t.number.validate(u, c), n => {
					try {
						const timestamp = new firebase.firestore.Timestamp(n, 0);
						return t.success(timestamp);
					} catch (err) {
						return t.failure(
							u,
							c,
							'cannot parse to firebase.firestore.Timestamp'
						);
					}
			  });
	},
	timestamp => timestamp.toDate()
);

const FirebaseGeoPoint = new t.Type<
	firebase.firestore.GeoPoint,
	{ lat: number; long: number },
	unknown
>(
	'FirebaseGeoPoint',
	(u): u is firebase.firestore.GeoPoint =>
		u instanceof firebase.firestore.GeoPoint,
	function(
		this: t.Type<
			firebase.firestore.GeoPoint,
			{ lat: number; long: number },
			unknown
		>,
		u,
		c
	) {
		return this.is(u)
			? t.success(u)
			: either.chain(
					t
						.type({
							lat: t.number,
							long: t.number,
						})
						.validate(u, c),
					coord => {
						try {
							const geopoint = new firebase.firestore.GeoPoint(
								coord.lat,
								coord.long
							);
							return t.success(geopoint);
						} catch (err) {
							return t.failure(u, c, 'cannot pare to firebase geopoint');
						}
					}
			  );
	},
	geopoint => {
		const { latitude: lat, longitude: long } = geopoint;
		return { lat, long };
	}
);

const MetroLine = t.union([
	t.literal('green line'),
	t.literal('yellow line'),
	t.literal('red line'),
]);

const NumberCodec = new t.Type<number, string, string>(
	'NumberCodec',
	t.number.is,
	(s, c) => {
		const n = parseFloat(s);
		return isNaN(n) ? t.failure(s, c) : t.success(n);
	},
	String
);

const NumberFromString = t.string.pipe(NumberCodec, 'NumberFromString');

export const DB = {
	Game: {
		Intel: {
			IntelItem: t.strict(
				{
					action: t.union(
						[
							t.strict(
								{
									type: t.union([t.literal('tram'), t.literal('bus')]),
									text: NumberFromString,
								},
								'Action_tramBus'
							),
							t.strict(
								{
									type: t.literal('metro'),
									text: MetroLine,
								},
								'Action_metro'
							),
							t.strict(
								{
									type: t.literal('walking'),
									text: t.string,
									coordinates: FirebaseGeoPoint,
								},
								'Action_walking'
							),
						],
						'IntelItemAction'
					),
					timestamp: FirebaseTimestamp,
				},
				'IntelItem'
			),
		},
	},
};
