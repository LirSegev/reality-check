import * as React from 'react';
import * as firebase from 'firebase/app';
import AppView from './App.view';

interface State {
	isLogged: boolean;
	gameId: string | null;
}

class AppContainer extends React.Component<{}, State> {
	constructor(props: {}) {
		super(props);

		this.state = {
			isLogged: false,
			gameId: null,
		};

		firebase.auth().onAuthStateChanged(player => {
			if (player && player.isAnonymous) {
				// Sign in
				const gameId = window.location.pathname.slice(1);
				this.setState({ gameId, isLogged: true });

				addPlayerToGame(player, gameId);
			} else {
				// Sign out
			}
		});
	}

	render() {
		return <AppView isLogged={this.state.isLogged} />;
	}
}

export default AppContainer;

function addPlayerToGame(player: firebase.User, gameId: string) {
	// prettier-ignore
	const gameDoc = firebase.firestore().collection('games').doc(gameId);

	gameDoc
		.collection('players')
		.where('uid', '==', player.uid)
		.get()
		.then(users => users.size >= 1)
		.then((isNew: boolean) => {
			if (!isNew) {
				// New player
				const dpEl: HTMLInputElement | null = document.querySelector(
					'input[name=displayName]'
				);
				const displayName = dpEl ? dpEl.value : 'agent';

				gameDoc.collection('players').add({
					displayName,
					location: null,
					uid: player.uid,
				});
			}
		})
		.catch(reason => console.error(reason));
}
