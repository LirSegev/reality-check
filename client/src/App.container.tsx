import * as React from 'react';
import * as firebase from 'firebase/app';
import AppView from './App.view';
import { signOut } from './util/firebase';
import {
	changeGame,
	adminSignin,
	signOut as signOutAction,
} from './reducers/main.reducer';
import { changeGameActionPayload } from './reducers/main.reducer.d';
import { connect } from 'react-redux';

interface State {
	isLogged: boolean;
}
interface Props {
	changeGame: (payload: changeGameActionPayload) => void;
	adminSignin: () => void;
	signOutAction: () => void;
}

class AppContainer extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			isLogged: false,
		};

		firebase.auth().onAuthStateChanged(player => {
			if (player && player.isAnonymous) this._onPlayerSignin(player);
			else if (player) {
				// Admin sign in
				this.setState({
					isLogged: true,
				});
				this.props.adminSignin();
			} else {
				// Sign out
				localStorage.removeItem('gameId');
				this.props.signOutAction();
				this.setState({
					isLogged: false,
				});
			}
		});
	}

	_onPlayerSignin(player: firebase.User) {
		const DEFAULT_ROLE = 'chaser' as DB.Game.Players.PlayerRole;

		const gameId =
			localStorage.getItem('gameId')! || window.location.pathname.slice(1);
		const displayNameEl: HTMLInputElement | null = document.querySelector(
			'input[name=displayName]'
		);
		const roleEl: HTMLSelectElement | null = document.querySelector(
			'Select[name="role"]'
		);

		const displayName = displayNameEl
			? displayNameEl.value || player.uid
			: player.uid;
		const role =
			roleEl && roleEl.value ? (roleEl.value as DB.Game.Players.PlayerRole) : DEFAULT_ROLE;
		const isNew = localStorage.getItem('gameId') ? false : true;

		this.setState({ isLogged: true });
		this.props.changeGame({ gameId });

		this._addPlayerToGame(player, gameId, displayName, role, isNew);
	}

	/**
	 * Adds player to game if they're not already in game
	 */
	_addPlayerToGame(
		player: firebase.User,
		gameId: string,
		displayName: string,
		role: DB.Game.Players.PlayerRole,
		isNew: boolean
	) {
		// prettier-ignore
		const gameDoc = firebase.firestore().collection('games').doc(gameId);

		if (isNew) {
			// New player

			gameDoc
				.collection('players')
				.add({
					displayName,
					location: null,
					uid: player.uid,
					role,
				})
				.catch(err => console.error(new Error('Error adding player'), err));

			player.updateProfile({
				displayName,
			});
			localStorage.setItem('gameId', gameId);
			// addPushNotifications(gameId);
		} else {
			// Player resigning in

			const db = firebase.firestore();
			db.collection('games')
				.doc(gameId)
				.get()
				.then(game => {
					if (!game.exists) {
						signOut();
					} else {
						game.ref
							.collection('players')
							.where('uid', '==', player.uid)
							.get()
							.then(value => {
								if (value.size < 1) signOut(false, true);
							})
							.catch(err =>
								console.error(
									new Error('Error checking if user exists in game'),
									err
								)
							);
					}
				})
				.catch(err =>
					console.error(new Error('Error checking if game exists:'), err)
				);
		}
	}

	render() {
		return <AppView {...this.state} />;
	}
}

const mapDispatchToProps = {
	changeGame,
	signOutAction,
	adminSignin,
};
export default connect(
	null,
	mapDispatchToProps
)(AppContainer);
