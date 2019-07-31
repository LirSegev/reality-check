import React from 'react';
import MapTabView from './Map.tab.view';
// import { Layer, Feature } from 'react-mapbox-gl';
import * as firebase from 'firebase/app';
import { Player } from '../../../../index.d';
import { Feature } from 'react-mapbox-gl';

interface PlayerLocation {
	playerName: string;
	longitude: number;
	latitude: number;
	timestamp: number;
}
interface State {
	playerLocations: {
		[uid: string]: PlayerLocation;
	};
}
interface Props {
	gameId: string;
}

class MapTabContainer extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			playerLocations: {},
		};

		this._updatePlayerLocations = this._updatePlayerLocations.bind(this);
	}

	componentDidMount() {
		const db = firebase.firestore();
		const { gameId } = this.props;

		db.collection(`games/${gameId}/players`).onSnapshot(
			this._updatePlayerLocations
		);
	}

	_updatePlayerLocations(playerList: firebase.firestore.QuerySnapshot) {
		playerList.forEach(doc => {
			const player = doc.data() as Player;
			if (player.location && player.uid !== firebase.auth().currentUser!.uid) {
				const playerLocation: PlayerLocation = {
					playerName: player.displayName,
					latitude: player.location.geopoint.latitude,
					longitude: player.location.geopoint.longitude,
					timestamp: player.location.timestamp.seconds,
				};

				this.setState(prevState => ({
					playerLocations: {
						...prevState.playerLocations,
						[player.uid]: playerLocation,
					},
				}));
			}
		});
	}

	render = () => {
		const playerLocationMarkers: JSX.Element[] = [];
		for (let uid in this.state.playerLocations) {
			const { latitude, longitude } = this.state.playerLocations[uid];
			playerLocationMarkers.push(
				<Feature
					key={'playerLocationMarker-' + uid}
					coordinates={[latitude, longitude]}
				/>
			);
		}

		return <MapTabView playerLocationMarkers={playerLocationMarkers} />;
	};
}

export default MapTabContainer;
