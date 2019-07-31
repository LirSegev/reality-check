import * as React from 'react';
import GameView from './Game.view';
import * as firebase from 'firebase/app';

interface Props {
	gameId: string;
	stopLoading: () => void;
}

class GameContainer extends React.Component<Props> {
	_watchId: number | undefined = undefined;

	componentDidMount() {
		this.props.stopLoading();

		if (navigator.geolocation)
			this._watchId = navigator.geolocation.watchPosition(
				this._updatePlayerLocation.bind(this)
			);
	}

	_updatePlayerLocation(pos: Position) {
		const db = firebase.firestore();
		const { latitude, longitude } = pos.coords;

		db.collection(`games/${this.props.gameId}/players`)
			.where('uid', '==', firebase.auth().currentUser!.uid)
			.get()
			.then(playerList => {
				if (playerList.size < 1) throw new Error('More than one user found');

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
					.catch(err => console.error(err));
			})
			.catch(err => console.error(err));
	}

	componentWillUnmount() {
		navigator.geolocation.clearWatch(this._watchId!);
	}

	render() {
		return <GameView gameId={this.props.gameId} />;
	}
}

export default GameContainer;
