import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { HttpsError } from 'firebase-functions/lib/providers/https';
import { manageDeviceGroup } from './util';

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

export const addDeviceToDeviceGroup = functions.https.onCall(
	(data: { token: string; gameId: string; groupName?: string }) => {
		const { token, gameId } = data;
		// If no groupName is supplied use gameId
		const groupName = data.groupName || gameId;
		return db
			.doc(`games/${gameId}`)
			.get()
			.then(doc => {
				if (doc.exists) return doc.data();
				else
					throw new HttpsError('not-found', 'A game with gameId was not found');
			})
			.then(game => {
				const notificationKey = game
					? (game.notificationKey as string | undefined)
					: undefined;
				if (notificationKey) {
					// A device group already exists for the game, add the device to it
					return manageDeviceGroup('add', [token], groupName, notificationKey)
						.then(() => 'Successfully added device to device group')
						.catch(err => {
							console.error(
								new Error('Error adding device to device group'),
								err
							);
							throw err;
						});
				} else {
					// No device group exists for the game, create one
					return manageDeviceGroup('create', [token], groupName)
						.then(key => {
							return db.doc(`games/${gameId}`).update({
								notificationKey: key,
							});
						})
						.then(() => 'Successfully added device to device group')
						.catch(err => {
							console.error(new Error('Error creating device group'), err);
							throw err;
						});
				}
			})
			.catch(err => {
				console.error(err);
				throw new HttpsError('internal', 'INTERNAL');
			});
	}
);

export const removeDeviceFromDeviceGroup = functions.https.onCall(
	(data: { token: string; gameId: string; groupName?: string }) => {
		const { token, gameId } = data;
		// If no groupName is supplied use gameId
		const groupName = data.groupName || gameId;
		return db
			.doc(`games/${gameId}`)
			.get()
			.then(doc => {
				if (doc.exists) return doc.data();
				else
					throw new HttpsError('not-found', 'A game with gameId was not found');
			})
			.then(game => {
				const notificationKey = game
					? (game.notificationKey as string | undefined)
					: undefined;
				if (notificationKey) {
					return manageDeviceGroup(
						'remove',
						[token],
						groupName,
						notificationKey
					)
						.then(() => 'Successfully removed device from device group')
						.catch(err => {
							console.error(
								new Error('Error removing device from device group'),
								err
							);
							throw err;
						});
				} else {
					// No device group exists for the game
					throw new HttpsError('not-found', "Game doesn't have a device group");
				}
			})
			.catch(err => {
				console.error(err);
				throw new HttpsError('internal', 'INTERNAL');
			});
	}
);
