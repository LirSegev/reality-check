import React from 'react';
import { Icon } from 'react-onsenui';
import { connect } from 'react-redux';
import { removeNotification } from '../reducers/main.reducer';
import {
	Notification,
	removeNotificationPayload,
} from '../reducers/main.reducer.d';
import styles from './Notification.module.css';

/* 
	Amount of time in seconds the notification is visible
*/
const DURATION = 2;

const ANIMATION_DURATION = 0.5;

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

	private timeout: any[] = [];

	componentDidMount() {
		(this.refs.notificationEl as HTMLDivElement).style.animationDuration =
			ANIMATION_DURATION + 's';

		(this.refs.notificationEl as HTMLDivElement).addEventListener(
			'animationend',
			this._onAnimationComplete
		);

		this.timeout.push(setTimeout(this._close, DURATION * 1000));
	}

	componentWillUnmount() {
		this.timeout.forEach(id => clearTimeout(id));

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
		(this.refs.notificationEl as HTMLDivElement).classList.add(styles.close);

		// Fallback incase the animation event doesn't fire
		const timeoutDuration = ANIMATION_DURATION * 1000 + 500;
		this.timeout.push(
			setTimeout(() => {
				this.props.removeNotification({ id: this.props.notification.id });
			}, timeoutDuration)
		);
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
