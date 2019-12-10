import * as firebase from 'firebase/app';
import React from 'react';
import { Card } from 'react-onsenui';
import { connect } from 'react-redux';

import { ReduxState } from '../../../../reducers/initialState';
import { moveToLocationOnMap } from '../../../../reducers/main.reducer';
import {
	PlayerLocation,
	PlayerLocations,
} from '../../../../reducers/map.reducer.d';
import styles from './Chat.module.css';
import { ChatItem as ChatItemDoc } from '../../../../util/db.types';

interface Props {
	author: ChatItemDoc['author'];
	message: string;
	timestamp: firebase.firestore.Timestamp;
	playerLocations: PlayerLocations;
	moveToLocationOnMap: ConnectedAction<typeof moveToLocationOnMap>;
}

class ChatItem extends React.Component<Props> {
	constructor(props: Props) {
		super(props);

		this._goToAuthorLocationOnMap = this._goToAuthorLocationOnMap.bind(this);
	}

	_goToAuthorLocationOnMap() {
		const { playerLocations, author, moveToLocationOnMap } = this.props;
		const playerLocation = playerLocations[author.uid] as
			| PlayerLocation
			| undefined;
		if (playerLocation)
			moveToLocationOnMap({
				lat: playerLocation.latitude,
				long: playerLocation.longitude,
				zoom: 16,
			});
	}

	render() {
		const { props } = this;

		const time = props.timestamp.toDate().toLocaleTimeString('en-GB', {
			hour: '2-digit',
			minute: '2-digit',
		});
		const isOwn = props.author.uid === firebase.auth().currentUser!.uid;

		const side = isOwn ? styles.right : styles.left;

		return (
			<Card className={[styles.chatItem, side].join(' ')}>
				{/* TODO: is the div needed? */}
				<div onClick={this._goToAuthorLocationOnMap}>
					{!isOwn && (
						<div className={styles.author}>{props.author.displayName}</div>
					)}
					<div className={styles.content}>
						{props.message}
						<div className={styles.time}>{time}</div>
					</div>
				</div>
			</Card>
		);
	}
}

const mapState = (state: ReduxState) => ({
	playerLocations: state.map.playerLocations,
});
const mapActions = {
	moveToLocationOnMap,
};
export default connect(mapState, mapActions)(ChatItem);
