import React from 'react';
import MapTabView from './Map.tab.view';
import * as firebase from 'firebase/app';
import { Player } from '../../../../index.d';
import { Feature } from 'react-mapbox-gl';
import { MapOrientation } from '../../../../index.d';
import { IntelItem } from '../../intel/Intel.d';

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
	mrZRoute: number[][];
}
interface Props {
	gameId: string;
	mapOrientation: MapOrientation;
	onMove: (map: mapboxgl.Map) => void;
}

class MapTabContainer extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			playerLocations: {},
			mrZRoute: [],
		};

		this._updatePlayerLocations = this._updatePlayerLocations.bind(this);
		this._updateMrZRoute = this._updateMrZRoute.bind(this);
	}

	componentDidMount() {
		const db = firebase.firestore();
		const { gameId } = this.props;

		db.collection(`games/${gameId}/players`).onSnapshot(
			this._updatePlayerLocations,
			err => console.error(err)
		);

		db.collection(`games/${gameId}/intel`)
			.orderBy('timestamp')
			.onSnapshot(this._updateMrZRoute, err => console.error(err));
	}

	_updateMrZRoute(intel: firebase.firestore.QuerySnapshot) {
		const mrZRoute = intel.docs
			.map(doc => doc.data() as IntelItem)
			.filter(
				intel => intel.action.type === 'walking' && intel.action.coordinates
			)
			.map(intel => {
				// @ts-ignore
				const point = intel.action.coordinates;
				return [point.longitude, point.latitude];
			});

		this.setState({
			mrZRoute,
		});
	}

	_updatePlayerLocations(playerList: firebase.firestore.QuerySnapshot) {
		let playerLocations: { [key: string]: PlayerLocation } = {};
		playerList.forEach(doc => {
			const player = doc.data() as Player;

			if (player.location && player.uid !== firebase.auth().currentUser!.uid) {
				const playerLocation: PlayerLocation = {
					playerName: player.displayName,
					latitude: player.location.geopoint.latitude,
					longitude: player.location.geopoint.longitude,
					timestamp: player.location.timestamp.seconds,
				};
				playerLocations[player.uid] = playerLocation;
			}
		});
		this.setState({ playerLocations });
	}

	render = () => {
		const playerLocationMarkers: JSX.Element[] = [];
		for (let uid in this.state.playerLocations) {
			const { latitude, longitude } = this.state.playerLocations[uid];
			playerLocationMarkers.push(
				<Feature
					key={'playerLocationMarker-' + uid}
					coordinates={[longitude, latitude]}
				/>
			);
		}

		return (
			<MapTabView
				playerLocationMarkers={playerLocationMarkers}
				mrZRoute={this.state.mrZRoute}
				mapOrientation={this.props.mapOrientation}
				onMove={this.props.onMove}
			/>
		);
	};
}

export default MapTabContainer;
