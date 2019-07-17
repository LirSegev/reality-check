import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import ons from 'onsenui';

// OnsenUI CSS
import 'onsenui/css/onsenui.css';
import 'onsenui/css/dark-onsen-css-components.css';

import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import firebaseConfig from './config/firebase';
firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged(user => {
	if (user) {
		// User sign in
		const gameId = window.location.pathname.slice(1);

		// prettier-ignore
		const gameDoc = firebase.firestore().collection('games').doc(gameId);

		if (user.isAnonymous)
			gameDoc
				.collection('players')
				.where('uid', '==', user.uid)
				.get()
				.then(users => users.size >= 1)
				.then((isNew: boolean) => {
					if (!isNew) {
						const dpEl: HTMLInputElement | null = document.querySelector(
							'input[name=displayName]'
						);
						const displayName = dpEl ? dpEl.value : 'agent';

						gameDoc.collection('players').add({
							displayName,
							location: null,
							uid: user.uid,
						});
					}
				})
				.catch(reason => console.error(reason));
	} else {
		// User sign out
	}
});

ons.ready(() => ReactDOM.render(<App />, document.getElementById('root')));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
