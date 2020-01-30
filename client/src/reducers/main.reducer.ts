import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import uniqid from 'uniqid';
import initialState from './initialState';
import {
	changeGameActionPayload,
	moveToLocationOnMapPayload,
	changeTabPayload,
	addNotificationPayload,
	removeNotificationPayload,
} from './main.reducer.d';

const main = createSlice({
	name: 'main',
	initialState: initialState.main,
	reducers: {
		stopLoading(state) {
			state.isLoading = false;
		},
		startLoading(state) {
			state.isLoading = true;
		},
		changeGame(state, action: PayloadAction<changeGameActionPayload>) {
			state.gameId = action.payload.gameId;
		},
		adminSignin(state) {
			state.isAdmin = true;
		},
		signOut(state) {
			state.isAdmin = initialState.main.isAdmin;
			state.gameId = initialState.main.gameId;
		},
		goToMapTab(state) {
			state.tabIndex = 2;
		},
		moveToLocationOnMap(
			state,
			action: PayloadAction<moveToLocationOnMapPayload>
		) {
			state.tabIndex = 2;
		},
		changeTab(state, action: PayloadAction<changeTabPayload>) {
			state.tabIndex = action.payload;
		},
		addNotification(state, action: PayloadAction<addNotificationPayload>) {
			state.notifications.unshift({
				...action.payload.notification,
				id: uniqid(),
			});
		},
		removeNotification(
			state,
			action: PayloadAction<removeNotificationPayload>
		) {
			const key = state.notifications.findIndex(notification => {
				return notification.id === action.payload.id;
			});

			if (key >= 0) state.notifications.splice(key, 1);
		},
	},
});

export const {
	startLoading,
	stopLoading,
	changeGame,
	adminSignin,
	signOut,
	changeTab,
	goToMapTab,
	moveToLocationOnMap,
	addNotification,
	removeNotification,
} = main.actions;
export default main.reducer;
