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

		firebase.auth().onAuthStateChanged(player => {
			if (player && player.isAnonymous) {
				// Player sign in

				const gameId = localStorage.getItem('gameId');
				if (gameId) {
					// Player resigning in

					const db = firebase.firestore();
					db.collection('games')
						.doc(gameId)
						.get()
						.then(game => {
							if (game.exists) {
								this.onPlayerLogin(player);
							} else {
								firebase.auth().signOut();
							}
						})
						.catch(reason => console.error(reason));
				} else {
					// First time signing in
					this.onPlayerLogin(player);
				}
			} else if (player) {
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

		this.stopLoading = this.stopLoading.bind(this);
		this.startLoading = this.startLoading.bind(this);
	}

	onPlayerLogin(player: firebase.User) {
		const gameId =
			localStorage.getItem('gameId')! || window.location.pathname.slice(1);
		const dpEl: HTMLInputElement | null = document.querySelector(
			'input[name=displayName]'
		);
		const displayName = dpEl ? dpEl.value || player.uid : player.uid;
		player.updateProfile({
			displayName,
		});

		this.setState({ gameId, isLogged: true });

		addPlayerToGame(player, gameId, displayName);
	}

	stopLoading() {
		this.setState({ isLoading: false });
	}

	startLoading() {
		this.setState({ isLoading: true });
	}

	render() {
		return (
			<AppView
				startLoading={this.startLoading}
				stopLoading={this.stopLoading}
				{...this.state}
			/>
		);
	}
}

export default AppContainer;

/**
 * Adds player to game if they're not already in game
 */
function addPlayerToGame(
	player: firebase.User,
	gameId: string,
	displayName: string
) {
	// prettier-ignore
	const gameDoc = firebase.firestore().collection('games').doc(gameId);

	if (!localStorage.getItem('gameId')) {
		// New player
		gameDoc.collection('players').add({
			displayName,
			location: null,
			uid: player.uid,
		});
		localStorage.setItem('gameId', gameId);
	}
}
