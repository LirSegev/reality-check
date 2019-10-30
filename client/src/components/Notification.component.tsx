import React from 'react';
import { Icon } from 'react-onsenui';
import { connect } from 'react-redux';
import {
	Notification,
	removeNotificationPayload,
	removeNotification,
} from '../reducers/main.reducer';
import styles from './Notification.module.css';

/* 
	Amount of time in seconds the notification is visible
*/
const DURATION = 0.5;

interface State {
	style: React.CSSProperties;
}
interface Props {
	notification: Notification;
	removeNotification: (payload: removeNotificationPayload) => void;
}

class NotificationComponent extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this._close = this._close.bind(this);
		this._onAnimationComplete = this._onAnimationComplete.bind(this);
	}

	private timeout: any = undefined;

	componentDidMount() {
		(this.refs.notificationEl as HTMLDivElement).style.animationDuration =
			DURATION + 's';

		// Fallback incase the animation event doesn't fire
		const timeoutDuration = DURATION * 1000 + 500;
		this.timeout = setTimeout(() => this._close, timeoutDuration);

		(this.refs.notificationEl as HTMLDivElement).addEventListener(
			'animationend',
			this._onAnimationComplete
		);
	}

	componentWillUnmount() {
		clearTimeout(this.timeout);

		(this.refs.notificationEl as HTMLDivElement).removeEventListener(
			'animationend',
			this._onAnimationComplete
		);
	}

	_onAnimationComplete(e: AnimationEvent) {
		if (e.animationName === styles.close)
			this.props.removeNotification({ id: this.props.notification.id });
	}

	_close() {
		// this.props.removeNotification({ id: this.props.notification.id });
		(this.refs.notificationEl as HTMLDivElement).classList.add(styles.close);
	}

	render() {
		return (
			<div
				className={`ui ${this.props.notification.type} message ${styles.notification} ${styles.open}`}
				ref="notificationEl"
			>
				<div className="close icon" onClick={this._close}>
					<Icon icon="fa-times" />
				</div>
				<div className="header">{this.props.notification.header}</div>
				{this.props.notification.content && (
					<p>{this.props.notification.content}</p>
				)}
			</div>
		);
	}
}

const mapActions = {
	removeNotification,
};
export default connect(
	null,
	mapActions
)(NotificationComponent);
