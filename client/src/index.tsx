import React from 'react';
import ReactDOM from 'react-dom';
import AppContainer from './App.container';
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

ons.ready(() =>
	ReactDOM.render(<AppContainer />, document.getElementById('root'))
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
