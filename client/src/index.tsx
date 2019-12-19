import React from 'react';
import ReactDOM from 'react-dom';
import AppContainer from './App.container';
import * as serviceWorker from './serviceWorker';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import reducers from './reducers';
import * as mainActions from './reducers/main.reducer';
import * as mapActions from './reducers/map.reducer';
import ons from 'onsenui';

// OnsenUI CSS
import 'onsenui/css/onsenui.css';
import 'onsenui/css/onsen-css-components.css';

import './global.css';

// Firebase
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/messaging';
import 'firebase/functions';
import 'firebase/storage';
import firebaseConfig from './config/firebase';
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
if (process.env.REACT_APP_IS_LOCAL) {
	db.settings({
		host: 'localhost:8080',
		ssl: false,
	});

	// Create game doc
	db.doc('games/test')
		.get()
		.then(doc => {
			if (!doc.exists) db.doc('games/test').set({ data: true });
		});
}
export { db };

// Eruda
(function() {
	const src = '//cdn.jsdelivr.net/npm/eruda';
	if (
		!/debug/.test(window.location.href) &&
		localStorage.getItem('active-eruda') !== 'true'
	)
		return;
	document.write(`<script src="${src}"></script>`);
	document.write('<script>eruda.init();</script>');
})();

// Redux
export const store = configureStore({
	reducer: reducers,
	devTools: {
		actionCreators: {
			...mainActions,
			...mapActions,
		},
	},
});

ons.ready(() =>
	ReactDOM.render(
		<Provider store={store}>
			<AppContainer />
		</Provider>,
		document.getElementById('root')
	)
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
