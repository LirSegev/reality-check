import * as firebase from 'firebase/app';

/**
 * Updates the data of the current player in the database.
 * @param data An object containing the fields and values with which to update the document. Fields can contain dots to reference nested fields within the document.
 * @returns A Promise resolved once the data has been successfully written to the backend (Note that it won't resolve while you're offline).
 */
export function updateCurrentPlayer(
	data: firebase.firestore.UpdateData
): Promise<void> {
	return new Promise((resolve, reject) => {
		const db = firebase.firestore();
		const gameId = localStorage.getItem('gameId');

		db.collection(`games/${gameId}/players`)
			.where('uid', '==', firebase.auth().currentUser!.uid)
			.get()
			.then(playerList => {
				if (playerList.size > 1) throw new Error('More than one user found');
				else if (playerList.size === 1) {
					const player = db.doc(
						`games/${gameId}/players/${playerList.docs[0].id}`
					);
					player
						.update(data)
						.then(() => {
							resolve();
						})
						.catch(err => {
							const error = new Error('Error updating user data:');
							console.error(error, err);
							reject(error);
						});
				}
			})
			.catch(err => {
				const error = new Error('Error getting player:');
				console.error(error, err);
				reject(error);
			});
	});
}
