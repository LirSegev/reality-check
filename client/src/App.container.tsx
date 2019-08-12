import * as React from 'react';
import * as firebase from 'firebase/app';
import AppView from './App.view';
import { updateCurrentPlayer } from './util/db';
import { signOut } from './util/firebase';

interface State {
	isLogged: boolean;
	gameId: string | null;
	isLoading: boolean;
	isAdmin: boolean;
}

class AppContainer extends React.Component<{}, State> {
	constructor(props: {}) {
		super(props);

		this.state = {
			isLogged: false,
			gameId: null,
			isLoading: true,
			isAdmin: false,
		};

		this.stopLoading = this.stopLoading.bind(this);
		this.startLoading = this.startLoading.bind(this);
		this.changeGame = this.changeGame.bind(this);

		firebase.auth().onAuthStateChanged(player => {
			if (player && player.isAnonymous) this._onPlayerSignin(player);
			else if (player) {
				// Admin sign in
				this.setState({
					isAdmin: true,
					isLogged: true,
				});
			} else {
				// Sign out
				localStorage.removeItem('gameId');
				this.setState({
					isLogged: false,
					gameId: null,
					isAdmin: false,
				});
			}
		});
	}

	_onPlayerSignin(player: firebase.User) {
		const gameId =
			localStorage.getItem('gameId')! || window.location.pathname.slice(1);
		const displayNameEl: HTMLInputElement | null = document.querySelector(
			'input[name=displayName]'
		);
		const displayName = displayNameEl
			? displayNameEl.value || player.uid
			: player.uid;
		const isNew = localStorage.getItem('gameId') ? false : true;
		player.updateProfile({
			displayName,
		});

		this.setState({ gameId, isLogged: true });

		this._addPlayerToGame(player, gameId, displayName, isNew);
	}

	/**
	 * Adds player to game if they're not already in game
	 */
	_addPlayerToGame(
		player: firebase.User,
		gameId: string,
		displayName: string,
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
				})
				.catch(err => console.error(new Error('Error adding player'), err));
			localStorage.setItem('gameId', gameId);
			this._addPushNotifications(gameId);
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
								if (value.size < 1) signOut();
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

	_addPushNotifications(gameId: string) {
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
						console.error(
							new Error("Error updating user's messagingToken"),
							err
						)
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

	stopLoading() {
		this.setState({ isLoading: false });
	}

	startLoading() {
		this.setState({ isLoading: true });
	}

	changeGame(gameId: string | null) {
		this.setState({ gameId });
	}

	render() {
		return (
			<AppView
				startLoading={this.startLoading}
				stopLoading={this.stopLoading}
				changeGame={this.changeGame}
				{...this.state}
			/>
		);
	}
}

export default AppContainer;
