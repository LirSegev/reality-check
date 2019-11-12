import React from 'react';
import { Icon } from 'react-onsenui';
import styles from './Notification.module.css';
import { Notification } from '../../../reducers/main.reducer.d';

interface Props {
	notification: Notification;
	close: () => void;
}

const NotificationView = React.forwardRef<HTMLDivElement, Props>(
	(props, ref) => (
		<div
			className={`ui ${
				props.notification.type ? props.notification.type : ''
			} message ${styles.notification} ${styles.open}`}
			ref={ref}
		>
			<div className="close icon" onClick={props.close}>
				<Icon icon="fa-times" />
			</div>
			<div className="header">{props.notification.header}</div>
			{props.notification.content && <p>{props.notification.content}</p>}
		</div>
	)
);

export default NotificationView;
