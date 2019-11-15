import { updateCurrentPlayer } from './db';

export const removePlayerFromDeviceGroup = (gameId: string) => (
	player: DB.Game.Players.Player | undefined
) => {
	if (player && player.messagingToken) {
		const removeDeviceFromDeviceGroup = firebase
			.functions()
			.httpsCallable('removeDeviceFromDeviceGroup');

		removeDeviceFromDeviceGroup({
			token: player.messagingToken,
			gameId,
		});
	} else {
		console.error(new Error("Player doesn't have messagingToken"));
	}
};

/**
 * Adds push notifications to the user and device
 * @description Gets messaging token for device, adds it to the current player's info at db and adds messaging token to `gameId` device group
 */
export function addPushNotifications(gameId: string) {
	try {
		const messaging = firebase.messaging();
		messaging
			.requestPermission()
			.then(() => messaging.getToken())
			.then(token => {
				if (token) return token;
				else throw new Error('Error got no token');
			})
			.then(token => {
				// TODO: Check if user already has messagingToken
				updateCurrentPlayer({
					messagingToken: token,
				}).catch(err =>
					console.error(new Error("Error updating user's messagingToken"), err)
				);

				const addDeviceToDeviceGroup = firebase
					.functions()
					.httpsCallable('addDeviceToDeviceGroup');
				addDeviceToDeviceGroup({
					token,
					gameId,
				}).catch(err =>
					console.error(new Error('Error adding device to device group'), err)
				);
			})
			.catch(err => console.log(err));

		messaging.onMessage(payload => {
			console.log('onMessage payload: ', payload);
		});
	} catch (err) {
		console.error(new Error('Error with Firebase messaging:'), err);
	}
}
