import * as firebase from 'firebase/app';
import { store } from '../index';
import { Player } from './db.types';

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
export async function getCurrentPlayer(): Promise<Player | undefined> {
	try {
		const ref = await getCurrentPlayerRef();
		const doc = await ref.get();
		return doc.data() as Player | undefined;
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
