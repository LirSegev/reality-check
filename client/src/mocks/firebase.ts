import { mockFirebase } from 'ts-mock-firebase';

const firebase = mockFirebase();

export default firebase;

export const app = firebase.initializeApp({});
