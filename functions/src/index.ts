import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import fetch from 'node-fetch';
import cloudMessagingConfig from './config/messaging';
import { HttpsError } from 'firebase-functions/lib/providers/https';

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

/**
 * Add, or remove registration tokens from Firebase Cloud Messaging device group
 * @param operation
 * @param ids Array of registration tokens to be used
 * @param groupName Unique notification_key_name
 * @param notificationKey notification_key of the group.
 */
function manageDeviceGroup(
	operation: 'add' | 'remove',
	ids: string[],
	groupName: string,
	notificationKey?: string
): Promise<string>;
/**
 * Create new Firebase Cloud Messaging device group
 * @param operation
 * @param ids Array of registration tokens to be used
 * @param groupName Unique notification_key_name
 */

function manageDeviceGroup(
	operation: 'create',
	ids: string[],
	groupName: string
): Promise<string>;
function manageDeviceGroup(
	operation: 'create' | 'add' | 'remove',
	ids: string[],
	groupName: string,
	notificationKey?: string
) {
	const url = 'https://fcm.googleapis.com/fcm/notification';
	const body: any = {
		operation,
		notification_key_name: groupName,
		registration_ids: ids,
	};
	if (notificationKey) body.notification_key = notificationKey;

	return fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `key=${cloudMessagingConfig.serverKey}`,
			project_id: cloudMessagingConfig.senderId,
		},
		body: JSON.stringify(body),
	})
		.then(res => res.json())
		.then(res => {
			if (res.notification_key) return res.notification_key as string;
			else if (res.error) throw new Error(res.error);
			else {
				console.error(res);
				throw new Error();
			}
		});
}
