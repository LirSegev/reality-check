import * as firebase from 'firebase/app';
import { getCurrentPlayer } from './db';

export function signOut(isAdmin?: boolean) {
	if (!isAdmin) {
		const gameId = localStorage.getItem('gameId');
		if (gameId)
			getCurrentPlayer().then(player => {
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
			});
		else console.error(new Error('Error no gameID'));
	}
	firebase.auth().signOut();
}
