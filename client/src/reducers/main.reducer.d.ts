export interface changeGameActionPayload {
	gameId: string | null;
}

export interface moveToLocationOnMapPayload {
	long: number;
	lat: number;
	zoom?: number;
}

export interface addNotificationPayload {
	notification: {
		type: NotificationType;
		header?: string;
		content?: string;
	};
}

type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
	id: string;
	type?: NotificationType;
	header?: string;
	content?: string;
}

export interface removeNotificationPayload {
	id: string;
}

export type changeTabPayload = number;
export type changeOpTabPayload = number;
