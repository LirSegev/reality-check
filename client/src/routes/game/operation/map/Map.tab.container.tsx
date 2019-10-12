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
import { NavigationControl } from 'mapbox-gl';

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
		this._showChaserPoints = this._showChaserPoints.bind(this);
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
		this._showChaserPoints(map);
		addGeolocateControl(map);

		const navigationControl = new NavigationControl({ showZoom: false });
		map.addControl(navigationControl, 'top-right');

		document.addEventListener(
			'show-transport-on-map',
			onShowTransportOnMapWrapper(map)
		);
	}

	_showChaserPoints(map: mapboxgl.Map) {
		const gameDoc = firebase.firestore().doc(`games/${this.props.gameId}`);
		gameDoc.onSnapshot(
			snap => {
				const game = snap.data();
				if (game) {
					const chaserSeq: string = String(game['chaser_sequence_num']) || '0';

					// prettier-ignore
					map.setFilter('chaser-points', ['has', chaserSeq, ['get', 'sequence']]);
					this._chasePointsSequenceToObj(map);
				}
			},
			err => console.error(new Error('Getting game doc'), err)
		);
	}

	_chasePointsSequenceToObj(map: mapboxgl.Map) {
		// @ts-ignore
		const { source, sourceLayer } = map.getLayer('chaser-points');
		if (typeof source === 'string' && sourceLayer) {
			const geoJson = map.querySourceFeatures(source, {
				sourceLayer,
			});

			const newGeoJson = geoJson.map(feature => {
				if (feature.properties && feature.properties.sequence) {
					const sequence: { [key: string]: number } = {};
					(JSON.parse(feature.properties.sequence) as number[]).forEach(
						num => (sequence[String(num)] = num)
					);
					feature.properties.sequence = sequence;
				}

				return feature;
			});

			const chasePoints = {
				type: 'FeatureCollection',
				features: newGeoJson,
			} as GeoJSON.FeatureCollection<GeoJSON.Geometry>;

			this._setLayerSource('chaser-points', chasePoints, map);
		} else console.error(new Error('Getting rolePoints GeoJson features'));
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
						this._savePointsToSession(map, layerId);
						map.setLayoutProperty(layerId, 'visibility', 'visible');
					}
				}
			})
			.catch(err =>
				console.error(new Error('Getting current player data from db'), err)
			);
	}

	_savePointsToSession(map: mapboxgl.Map, layerId: string) {
		// @ts-ignore
		const { source, sourceLayer } = map.getLayer(layerId);
		if (typeof source === 'string' && sourceLayer) {
			const geoJson = map.querySourceFeatures(source, {
				sourceLayer,
			});
			sessionStorage.setItem('role_points', JSON.stringify(geoJson));
		} else console.error(new Error('Getting rolePoints GeoJson features'));
	}

	_hideCollectedPoints(
		map: mapboxgl.Map,
		layerId: string,
		playerRole: PlayerRole
	) {
		const db = firebase.firestore();
		db.doc(`games/${this.props.gameId}`).onSnapshot(
			snapshot => {
				const game = snapshot.data();
				let pointType = '';
				switch (playerRole) {
					case 'detective':
						pointType = 'identity';
						break;
					case 'intelligence':
						pointType = 'intelligence';
						break;
				}

				if (game) {
					// prettier-ignore
					const collectedPoints = (game[`collected_${pointType}_points`] as number[] | undefined) || [];
					if (playerRole === 'intelligence')
						// Filter out collected points
						map.setFilter(layerId, ['!in', 'id', ...collectedPoints]);
					else if (playerRole === 'detective')
						// Filter out collected points and points for higher phases
						map.setFilter(layerId, [
							'all',
							['!in', 'id', ...collectedPoints],
							['<=', 'phase', game.phase || 0],
						]);

					// Save collected points list to sessionStorage
					sessionStorage.setItem(
						'collected_points',
						JSON.stringify(collectedPoints)
					);
					// Save phase to sessionStorage
					sessionStorage.setItem('phase', game.phase || 0);
				}
			},
			err => console.error(new Error('Getting game doc'), err)
		);
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
