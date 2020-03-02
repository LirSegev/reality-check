export interface changeGameActionPayload {
	gameId: string | null;
}

export interface moveToLocationOnMapPayload {
	long: number;
	lat: number;
	zoom?: number;
}

export interface addNotificationPayload {
	notification: NotificationWithoutId;
}

type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification extends NotificationWithoutId {
	id: string;
}

interface NotificationWithoutId {
	type?: NotificationType;
	header: string;
	content?: string;
	/**
	 * Duration in seconds.
	 * Defaults to 2s
	 */
	duration?: number | 'none';
}

export interface removeNotificationPayload {
	id: string;
}

export type changeTabPayload = number;
export type changeOpTabPayload = number;
