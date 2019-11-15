import React from 'react';
import { connect } from 'react-redux';

import { removeNotification } from '../../../reducers/main.reducer';
import { Notification } from '../../../reducers/main.reducer.d';
import styles from './Notification.module.css';
import NotificationView from './Notification.view';

/* 
	Amount of time in seconds the notification is visible
*/
const DEFAULT_DURATION = 2;

const ANIMATION_DURATION = 0.5;

interface State {
	style: React.CSSProperties;
}
interface Props {
	notification: Notification;
	removeNotification: ConnectedAction<typeof removeNotification>;
}

class NotificationContainer extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this._close = this._close.bind(this);
		this._onAnimationComplete = this._onAnimationComplete.bind(this);
	}

	private timeout: any[] = [];

	componentDidMount() {
		if (this._notificationEl.current) {
			this._notificationEl.current.style.animationDuration =
				ANIMATION_DURATION + 's';

			this._notificationEl.current.addEventListener(
				'animationend',
				this._onAnimationComplete
			);
		}

		const duration = this.props.notification.duration || DEFAULT_DURATION;
		if (duration !== 'none')
			this.timeout.push(setTimeout(this._close, duration * 1000));
	}

	componentWillUnmount() {
		this.timeout.forEach(id => clearTimeout(id));

		if (this._notificationEl.current)
			this._notificationEl.current.removeEventListener(
				'animationend',
				this._onAnimationComplete
			);
	}

	_onAnimationComplete(e: AnimationEvent) {
		if (e.animationName === styles.close)
			this.props.removeNotification({ id: this.props.notification.id });
	}

	_close() {
		if (this._notificationEl.current)
			this._notificationEl.current.classList.add(styles.close);

		// Fallback incase the animation event doesn't fire
		const timeoutDuration = ANIMATION_DURATION * 1000 + 500;
		this.timeout.push(
			setTimeout(() => {
				this.props.removeNotification({ id: this.props.notification.id });
			}, timeoutDuration)
		);
	}

	_notificationEl = React.createRef<HTMLDivElement>();

	render() {
		return (
			<NotificationView
				close={this._close}
				notification={this.props.notification}
				ref={this._notificationEl}
			/>
		);
	}
}

const mapActions = {
	removeNotification,
};
export default connect(null, mapActions)(NotificationContainer);
