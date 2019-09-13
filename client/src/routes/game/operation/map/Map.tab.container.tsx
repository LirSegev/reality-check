import React from 'react';
import MapTabView from './Map.tab.view';
import * as firebase from 'firebase/app';
import { IntelItem, MetroLine } from '../../intel/Intel.d';
import {
	FeatureCollection,
	Geometry,
	GeoJsonProperties,
	Feature as GeoFeature,
} from 'geojson';
import { GeolocateControl, EventData } from 'mapbox-gl';

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
		this._addTransportRoutesLayer = this._addTransportRoutesLayer.bind(this);
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

	_addTransportRoutesLayer(map: mapboxgl.Map) {
		const geoJsonUrl =
			'http://opendata.iprpraha.cz/CUR/DOP/DOP_PID_TRASY_L/WGS_84/DOP_PID_TRASY_L.json';
		fetch(geoJsonUrl)
			.then(res => res.json())
			.then(this._tramListStringToArray)
			.then(data => {
				map.addLayer({
					id: 'transport-routes',
					source: {
						type: 'geojson',
						data,
					},
					paint: {
						'line-color': '#50a882',
						'line-width': 10,
					},
					// Filter out all features
					filter: ['==', '1', '2'],
					type: 'line',
				});
			})
			.catch(err =>
				console.error(
					new Error('Error adding transport-routes layer to map:'),
					err
				)
			);
	}

	_onDeviceorientationabsoluteWrapper = (map: mapboxgl.Map) => (
		e: DeviceOrientationEvent
	) => {
		const bearing = e.alpha ? Math.round(360 - e.alpha) : null;
		if (bearing) this._updateBearing(map, bearing);
	};

	_onDeviceorientationWrapper = (map: mapboxgl.Map) => (
		e: DeviceOrientationEvent
	) => {
		// @ts-ignore
		const bearing = Math.round(e.webkitCompassHeading as number);
		if (bearing) this._updateBearing(map, bearing);
	};

	_updateBearing(map: mapboxgl.Map, bearing: number) {
		if (!map.isEasing())
			map.setBearing(bearing, { geolocateSource: true } as EventData);
	}

	_onStyleLoad(map: mapboxgl.Map) {
		// this._addTransportRoutesLayer(map);
		this._markPlayerLocations(map);

		const geolocateControl = new GeolocateControl({
			positionOptions: {
				enableHighAccuracy: true,
			},
			trackUserLocation: true,
		});

		const onDeviceorientationabsolute = this._onDeviceorientationabsoluteWrapper(
			map
		);
		const onDeviceorientation = this._onDeviceorientationWrapper(map);

		const isIOS =
			!!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
		geolocateControl.on('trackuserlocationstart', () => {
			if (isIOS)
				window.addEventListener('deviceorientation', onDeviceorientation);
			else
				window.addEventListener(
					'deviceorientationabsolute',
					onDeviceorientationabsolute
				);
		});
		geolocateControl.on('trackuserlocationend', () => {
			if (isIOS)
				window.removeEventListener('deviceorientation', onDeviceorientation);
			else
				window.removeEventListener(
					'deviceorientationabsolute',
					onDeviceorientationabsolute
				);
			// Reset bearing
			map.rotateTo(0, { geolocateSource: true } as EventData);
		});

		map.addControl(geolocateControl);

		document.addEventListener('show-transport-on-map', e => {
			const { type, line } = (e as CustomEvent<{
				type: 'tram' | 'metro';
				line: number | string;
			}>).detail;

			switch (type) {
				case 'tram':
					map.setFilter('transport-routes', [
						'has',
						String(line),
						['get', 'L_TRAM'],
					]);
					break;

				case 'metro':
					let mLine: string;
					switch (line) {
						case MetroLine.A:
							mLine = 'METRO A';
							break;
						case MetroLine.B:
							mLine = 'METRO B';
							break;
						case MetroLine.C:
							mLine = 'METRO C';
							break;
						default:
							mLine = '*';
					}
					map.setFilter('transport-routes', ['==', ['get', 'L_METRO'], mLine]);
					break;
			}
		});
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

	_tramListStringToArray(res: any) {
		if (res.features)
			return {
				...res,
				features: (res as FeatureCollection).features.map(feature => {
					let result: GeoFeature<Geometry, GeoJsonProperties> = {
						...feature,
					};
					const tramList = feature.properties!['L_TRAM'] as string | null;
					if (tramList) {
						result.properties!['L_TRAM'] = {};
						tramList
							.split(', ')
							.forEach(
								tramNum =>
									(result.properties!['L_TRAM'][tramNum] = Number(tramNum))
							);
					} else if (tramList == null) {
						result.properties!['L_TRAM'] = {};
					}
					return result;
				}),
			} as FeatureCollection<Geometry, GeoJsonProperties>;
	}
}

export default MapTabContainer;
