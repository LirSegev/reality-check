import * as React from 'react';
import * as firebase from 'firebase/app';
import AppView from './App.view';

interface State {
	isLogged: boolean;
	gameId: string | null;
	isLoading: boolean;
}

class AppContainer extends React.Component<{}, State> {
	constructor(props: {}) {
		super(props);

		this.state = {
			isLogged: false,
			gameId: null,
			isLoading: true,
		};

		firebase.auth().onAuthStateChanged(player => {
			if (player && player.isAnonymous) {
				// Sign in
				this.onPlayerLogin(player);
			} else {
				// Sign out
			}
		});

		this.stopLoading = this.stopLoading.bind(this);
	}

	onPlayerLogin(player: firebase.User) {
		const gameId = window.location.pathname.slice(1);
		const dpEl: HTMLInputElement | null = document.querySelector(
			'input[name=displayName]'
		);
		const displayName = dpEl ? dpEl.value : 'Agent';
		player.updateProfile({
			displayName,
		});

		this.setState({ gameId, isLogged: true });

		addPlayerToGame(player, gameId, displayName);
	}

	stopLoading() {
		this.setState({ isLoading: false });
	}

	render() {
		return <AppView stopLoading={this.stopLoading} {...this.state} />;
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

	gameDoc
		.collection('players')
		.where('uid', '==', player.uid)
		.get()
		.then(users => !(users.size >= 1))
		.then((isNew: boolean) => {
			if (isNew)
				// New player
				gameDoc.collection('players').add({
					displayName,
					location: null,
					uid: player.uid,
				});
		})
		.catch(reason => console.error(reason));
}
