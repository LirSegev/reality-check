import React from 'react';
import MapTabView from './Map.tab.view';
import * as firebase from 'firebase/app';
import { IntelItem } from '../../intel/Intel.d';
import {
	onShowTransportOnMapWrapper,
	// addTransportRoutesLayer,
} from './transport.module';
import { addGeolocateControl } from './geolocateControl.module';
import { getCurrentPlayer } from '../../../../util/db';

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
		this._onStyleLoad = this._onStyleLoad.bind(this);
		this._hideCollectedPoints = this._hideCollectedPoints.bind(this);
	}

	componentDidMount() {
		const db = firebase.firestore();
		const { gameId } = this.props;

		db.collection(`games/${gameId}/players`).onSnapshot(
			this._updatePlayerLocations,
			err => console.error(new Error('Error getting player list'), err)
		);

		db.collection(`games/${gameId}/intel`)
			.orderBy('timestamp')
			.onSnapshot(this._updateMrZRoute, err =>
				console.error(new Error('Error getting intel snapshot:'), err)
			);
	}

	_updateMrZRoute(intel: firebase.firestore.QuerySnapshot) {
		const mrZRoute = intel.docs
			.map(doc => doc.data() as IntelItem)
			.filter(
				intel => intel.action.type === 'walking' && intel.action.coordinates
			)
			.map(intel => {
				// @ts-ignore
				const point = intel.action.coordinates as firebase.firestore.GeoPoint;
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

	_onStyleLoad(map: mapboxgl.Map) {
		// addTransportRoutesLayer(map);
		this._markPlayerLocations(map);
		this._showRolePoints(map);
		addGeolocateControl(map);

		document.addEventListener(
			'show-transport-on-map',
			onShowTransportOnMapWrapper(map)
		);
	}

	/**
	 * Show role specific layers on map.
	 * Show intelligence points to intelligence collector and so on.
	 */
	_showRolePoints(map: mapboxgl.Map) {
		getCurrentPlayer()
			.then(player => {
				if (player) {
					let layerId = '';
					switch (player.role) {
						case 'detective':
							layerId = 'identity-points';
							break;
						case 'intelligence':
							layerId = 'intelligence-points';
							break;
					}

					if (layerId) {
						this._hideCollectedPoints(map, layerId, player.role);
						map.setLayoutProperty(layerId, 'visibility', 'visible');
					}
				}
			})
			.catch(err =>
				console.error(new Error('Getting current player data from db'), err)
			);
	}

	_hideCollectedPoints(
		map: mapboxgl.Map,
		layerId: string,
		playerRole: PlayerRole
	) {
		const db = firebase.firestore();
		db.doc(`games/${this.props.gameId}`)
			.get()
			.then(doc => doc.data())
			.then(game => {
				let pointType = '';
				switch (playerRole) {
					case 'detective':
						pointType = 'identity';
						break;
					case 'intelligence':
						pointType = 'intelligence';
						break;
				}

				if (game)
					return game[`collected_${pointType}_points`] as [] | undefined;
			})
			.then(collectedPoints => {
				if (collectedPoints)
					map.setFilter(layerId, ['!in', 'name', ...collectedPoints]);
			})
			.catch(err => console.log(new Error('Getting game doc'), err));
	}

	_markPlayerLocations(map: mapboxgl.Map) {
		const playerLocationMarkers: GeoJSON.Feature<GeoJSON.Geometry>[] = [];
		for (let uid in this.state.playerLocations) {
			const { latitude, longitude, playerName } = this.state.playerLocations[
				uid
			];
			playerLocationMarkers.push({
				type: 'Feature',
				properties: {
					name: playerName,
				},
				geometry: {
					type: 'Point',
					coordinates: [longitude, latitude],
				},
			});
		}

		this._setLayerSource(
			'player-locations',
			{ type: 'FeatureCollection', features: playerLocationMarkers },
			map
		);
	}

	_setLayerSource(
		layerId: string,
		source:
			| GeoJSON.Feature<GeoJSON.Geometry>
			| GeoJSON.FeatureCollection<GeoJSON.Geometry>
			| string,
		map: mapboxgl.Map
	) {
		const oldLayers = map.getStyle().layers!;
		const layerIndex = oldLayers.findIndex(l => l.id === layerId);
		const layerDef = oldLayers[layerIndex];
		const before = oldLayers[layerIndex + 1] && oldLayers[layerIndex + 1].id;
		layerDef.source = {
			type: 'geojson',
			data: source,
		};
		layerDef.layout!.visibility = 'visible';
		delete layerDef['source-layer'];
		map.removeLayer(layerId);
		map.addLayer(layerDef, before);
	}

	render = () => {
		return (
			<MapTabView
				mrZRoute={this.state.mrZRoute}
				mapOrientation={this.props.mapOrientation}
				onMove={this.props.onMove}
				onStyleLoad={this._onStyleLoad}
			/>
		);
	};
}

export default MapTabContainer;
