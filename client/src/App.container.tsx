import * as React from 'react';
import * as firebase from 'firebase/app';
import AppView from './App.view';

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
		} else {
			// Player resigning in

			const db = firebase.firestore();
			db.collection('games')
				.doc(gameId)
				.get()
				.then(game => {
					if (!game.exists) {
						firebase.auth().signOut();
					}
				})
				.catch(err =>
					console.error(new Error('Error checking if game exists:'), err)
				);
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
