import fetch from 'node-fetch';
import cloudMessagingConfig from './config/messaging';

/**
 * Add, or remove registration tokens from Firebase Cloud Messaging device group
 * @param operation
 * @param ids Array of registration tokens to be used
 * @param groupName Unique notification_key_name
 * @param notificationKey notification_key of the group.
 */
export function manageDeviceGroup(
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

export function manageDeviceGroup(
	operation: 'create',
	ids: string[],
	groupName: string
): Promise<string>;
export function manageDeviceGroup(
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
	if (operation === 'add' || operation === 'remove')
		body.notification_key = notificationKey;

	return fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `key=${cloudMessagingConfig.serverKey}`,
			project_id: cloudMessagingConfig.senderId,
		},
		body: JSON.stringify(body),
	})
		.then(res => {
			if (res.status >= 200 && res.status < 300) return res;
			else throw res;
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
