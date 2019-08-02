import * as React from 'react';
import GameView from './Game.view';
import * as firebase from 'firebase/app';

interface Props {
	gameId: string;
	isAdmin: boolean;
	stopLoading: () => void;
}

class GameContainer extends React.Component<Props> {
	_watchId: number | undefined = undefined;

	componentDidMount() {
		this.props.stopLoading();

		if (navigator.geolocation)
			navigator.geolocation.getCurrentPosition(pos => {
				this._updateLastPos(pos);
				setInterval(() => {
					if (this._lastPos) this._updatePlayerLocation(this._lastPos);
				}, 30 * 1000);
			});

		this._watchId = navigator.geolocation.watchPosition(pos => {
			this._updateLastPos(pos);
		});
	}

	_lastPos: Position | null = null;

	_updateLastPos(pos: Position) {
		this._lastPos = pos;
	}

	_updatePlayerLocation(pos: Position) {
		const db = firebase.firestore();
		const { latitude, longitude } = pos.coords;

		db.collection(`games/${this.props.gameId}/players`)
			.where('uid', '==', firebase.auth().currentUser!.uid)
			.get()
			.then(playerList => {
				if (playerList.size > 1) throw new Error('More than one user found');
				else if (playerList.size === 1) {
					const player = db.doc(
						`games/${this.props.gameId}/players/${playerList.docs[0].id}`
					);
					player
						.update({
							location: {
								geopoint: new firebase.firestore.GeoPoint(latitude, longitude),
								timestamp: new firebase.firestore.Timestamp(
									Math.round(pos.timestamp / 1000),
									0
								),
							},
						})
						.catch(err =>
							console.error(new Error('Error updating user location:'), err)
						);
				}
			})
			.catch(err => console.error(new Error('Error getting player:'), err));
	}

	componentWillUnmount() {
		navigator.geolocation.clearWatch(this._watchId!);
	}

	render() {
		return <GameView isAdmin={this.props.isAdmin} gameId={this.props.gameId} />;
	}
}

export default GameContainer;
