import * as firebase from 'firebase/app';
import { store } from '../index';

/**
 * Updates the data of the current player in the database.
 * @param data An object containing the fields and values with which to update the document. Fields can contain dots to reference nested fields within the document.
 * @returns A Promise resolved once the data has been successfully written to the backend (Note that it won't resolve while you're offline).
 */
export function updateCurrentPlayer(
	data: firebase.firestore.UpdateData
): Promise<void> {
	return new Promise((resolve, reject) => {
		getGameDocRef()
			.collection('players')
			.where('uid', '==', firebase.auth().currentUser!.uid)
			.get()
			.then(playerList => {
				if (playerList.size > 1) throw new Error('More than one user found');
				else if (playerList.size === 1) {
					const player = getGameDocRef()
						.collection('players')
						.doc(playerList.docs[0].id);
					player
						.update(data)
						.then(() => {
							resolve();
						})
						.catch(err => {
							const error = new Error('Updating user data');
							console.error(error, err);
							reject(error);
						});
				} else {
					throw new Error('No users found');
				}
			})
			.catch(err => {
				const error = new Error('Getting user');
				console.error(error, err);
				reject(error);
			});
	});
}

/**
 * Gets the data of the current player from the database.
 */
export function getCurrentPlayer(): Promise<Player | undefined> {
	return new Promise((resolve, reject) => {
		getGameDocRef()
			.collection('players')
			.where('uid', '==', firebase.auth().currentUser!.uid)
			.get()
			.then(playerList => {
				if (playerList.size > 1) throw new Error('More than one user found');
				else if (playerList.size === 1) {
					const player = getGameDocRef()
						.collection('players')
						.doc(playerList.docs[0].id);
					player
						.get()
						.then(doc => doc.data() as Player | undefined)
						.then(resolve)
						.catch(err => {
							const error = new Error('Getting user');
							console.error(error, err);
							reject(error);
						});
				} else {
					throw new Error('No users found');
				}
			})
			.catch(err => {
				const error = new Error('Getting user');
				console.error(error, err);
				reject(error);
			});
	});
}

export function dateToTimestamp(date: Date): firebase.firestore.Timestamp {
	const domTimestamp = date.getTime() / 1000 + '';
	const arr = domTimestamp.split('.').map(num => Number(num));
	const timestamp = new firebase.firestore.Timestamp(arr[0], arr[1]);

	return timestamp;
}

export function getGameDocRef(): firebase.firestore.DocumentReference {
	const db = firebase.firestore();
	const gameId = store.getState().main.gameId;
	if (!gameId)
		throw new Error('Could not get gameDocRef because gameId is not set');

	return db.doc(`games/${gameId}`);
}
