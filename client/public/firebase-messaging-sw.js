importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');

const firebaseConfig = {
	apiKey: 'AIzaSyBcPUPtr_37iqBlCUHpJhZy5cP8FBKqNY4',
	authDomain: 'reality-check-d6fe7.firebaseapp.com',
	databaseURL: 'https://reality-check-d6fe7.firebaseio.com',
	projectId: 'reality-check-d6fe7',
	storageBucket: 'reality-check-d6fe7.appspot.com',
	messagingSenderId: '243239923760',
	appId: '1:243239923760:web:f6bc0b9da0893fa7',
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();
