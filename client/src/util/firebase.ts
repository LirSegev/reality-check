import * as firebase from 'firebase/app';
import { updateCurrentPlayer } from './db';

/* const removePlayerFromDeviceGroup = (gameId: string) => (
	player: Player | undefined
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
}; */

export function signOut(isAdmin?: boolean, notInGame?: boolean) {
	/**
	 * Array of promises to complete before signing user out.
	 */
	const doBeforeSignOut: Promise<any>[] = [];

	if (!isAdmin && !notInGame) {
		const gameId = localStorage.getItem('gameId');
		if (gameId) {
			/* doBeforeSignOut.push(
				getCurrentPlayer().then(removePlayerFromDeviceGroup(gameId))
			); */
			doBeforeSignOut.push(
				updateCurrentPlayer({
					isDeleted: true,
				} as Player)
			);
		} else console.error(new Error('Error no gameID'));
	}
	Promise.all(doBeforeSignOut)
		.then(() => {
			const auth = firebase.auth();
			if (isAdmin) auth.signOut();
			else auth.currentUser!.delete();
		})
		.catch(err => console.error(new Error('Signing out'), err));
}
