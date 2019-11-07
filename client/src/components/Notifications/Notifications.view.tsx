import React from 'react';
import { ReduxState } from '../../reducers/initialState';
import { connect } from 'react-redux';
import { Notification } from '../../reducers/main.reducer.d';
import NotificationComponent from './Notification';

interface Props {
	notifications: Notification[];
}

const NotificationsContainer: React.FC<Props> = props => (
	<div id="notifications">
		{props.notifications.map(notification => (
			<NotificationComponent
				key={`notification_${notification.id}`}
				notification={notification}
			/>
		))}
	</div>
);

const mapState = (state: ReduxState) => ({
	notifications: state.main.notifications,
});
export default connect(mapState)(NotificationsContainer);
