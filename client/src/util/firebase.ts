import * as firebase from 'firebase/app';
import { getCurrentPlayer, updateCurrentPlayer } from './db';

export function signOut(isAdmin?: boolean) {
	const doBeforeSignOut: Promise<any>[] = [];

	if (!isAdmin) {
		const gameId = localStorage.getItem('gameId');
		if (gameId) {
			doBeforeSignOut.push(
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
				})
			);
			doBeforeSignOut.push(
				updateCurrentPlayer({
					isDeleted: true,
				} as Player)
			);
		} else console.error(new Error('Error no gameID'));
	}
	Promise.all(doBeforeSignOut).then(() => firebase.auth().signOut());
}
