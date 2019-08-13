import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import fetch from 'node-fetch';
import { HttpsError } from 'firebase-functions/lib/providers/https';
import { manageDeviceGroup } from './util';
import cloudMessagingConfig from './config/messaging';

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

export const addDeviceToDeviceGroup = functions.https.onCall(
	(data: { token: string; gameId: string; groupName?: string }) => {
		const { token, gameId } = data;

		if (!token) return new HttpsError('invalid-argument', 'token is required');
		if (!gameId)
			return new HttpsError('invalid-argument', 'gameId is required');

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

		if (!token) return new HttpsError('invalid-argument', 'token is required');
		if (!gameId)
			return new HttpsError('invalid-argument', 'gameId is required');

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

export const sendNotificationToGroup = functions.https.onCall(
	(data: {
		notificationKey: string;
		notification: admin.messaging.NotificationMessagePayload;
	}) => {
		const { notificationKey, notification } = data;

		if (!notificationKey)
			return new HttpsError('invalid-argument', 'notificationKey is required');
		if (!notification)
			// prettier-ignore
			return new HttpsError('invalid-argument', 'notification object is required')

		const url = 'https://fcm.googleapis.com/fcm/send';

		return fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `key=${cloudMessagingConfig.serverKey}`,
				project_id: cloudMessagingConfig.senderId,
			},
			body: JSON.stringify({
				to: notificationKey,
				notification,
			}),
		})
			.then(res => {
				if (res.status >= 200 && res.status < 300) return res;
				else throw res;
			})
			.then(res => res.json())
			.then(res => {
				if (
					Object.keys(res).includes('success') &&
					Object.keys(res).includes('failure')
				)
					return res;
				else throw new HttpsError('unknown', 'Unexpected response type', res);
			});
	}
);
