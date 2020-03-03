import * as firebase from 'firebase/app';
import { GeoJSONSource, NavigationControl } from 'mapbox-gl';
import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import { ReduxState } from '../../../../reducers/initialState';
import {
	changeDestination,
	setPlayerLocations,
} from '../../../../reducers/map.reducer';
import {
	PlayerLocation,
	PlayerLocations,
} from '../../../../reducers/map.reducer.d';
import { createLocationselectEvent } from '../../../../util/customEvents/factories';
import { getCurrentPlayer, getGameDocRef } from '../../../../util/db';
import { IntelItem, Player, PlayerRole } from '../../../../util/db.types';
import { isIOS } from '../../../../util/general';
import { addGeolocateControl } from './controls/geolocateControl.module';
import PhaseSelectControl from './controls/phaseSelectControl';
import RoleSelectControl from './controls/roleSelectControl.module';
import LegendControl from './Legend/legendControl';
import styles from './Map.module.css';
import MapTabView from './Map.tab.view';
import Transport from './transport.class';

// @ts-ignore
const $ = window.$ as JQueryStatic;

interface State {
	mrZRoute: number[][];
}
interface Props {
	isAdmin: boolean;
	onMove: (map: mapboxgl.Map) => void;
	changeDestination: ConnectedAction<typeof changeDestination>;
	playerLocations: PlayerLocations;
	setPlayerLocations: ConnectedAction<typeof setPlayerLocations>;
	isWaitingForLocation: boolean;
}

class MapTabContainer extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			mrZRoute: [],
		};

		this._updatePlayerLocations = this._updatePlayerLocations.bind(this);
		this._updateMrZRoute = this._updateMrZRoute.bind(this);
		this._onStyleLoad = this._onStyleLoad.bind(this);
		this._hideCollectedPoints = this._hideCollectedPoints.bind(this);
		this._showChaserPoints = this._showChaserPoints.bind(this);
		this._onLongPress = this._onLongPress.bind(this);
	}

	_snapshots: Array<() => void> = [];

	componentDidMount() {
		this._snapshots.push(
			getGameDocRef()
				.collection('players')
				.onSnapshot(this._updatePlayerLocations, err =>
					console.error(new Error('Error getting player list'), err)
				)
		);

		this._snapshots.push(
			getGameDocRef()
				.collection('intel')
				.orderBy('timestamp')
				.onSnapshot(this._updateMrZRoute, err =>
					console.error(new Error('Error getting intel snapshot:'), err)
				)
		);
	}

	componentWillUnmount() {
		this._snapshots.forEach(unsubscribe => unsubscribe());
	}

	componentDidUpdate(prevProps: Props) {
		if (
			this._markPlayerLocations &&
			JSON.stringify(prevProps.playerLocations) !==
				JSON.stringify(this.props.playerLocations)
		)
			this._markPlayerLocations();
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
		this.props.setPlayerLocations({ playerLocations });
	}

	_onStyleLoad(map: mapboxgl.Map) {
		this._markPlayerLocations = this._markPlayerLocationsWrapper(map);
		this._markPlayerLocations();
		this._showIntelligenceAndDetectivePoints(map);
		this._showChaserPoints(map);
		this._showZone(map);
		this._listenToLongPress(map, this._onLongPress);
		this._addControls(map);
		this._stopSwiping(map);
		new Transport(map);
	}

	_stopSwiping(map: mapboxgl.Map) {
		/**
		 * Width in pixels of areas for swiping
		 */
		const THRESHOLD = 50;

		const listener = (e: mapboxgl.MapTouchEvent & mapboxgl.EventData) => {
			if (
				e.point.x >= THRESHOLD &&
				e.point.x <= map.getContainer().clientWidth - THRESHOLD
			)
				e.originalEvent.stopPropagation();
		};

		map.on('touchstart', listener);
		// map.on('touchmove', listener);
		// map.on('touchend', listener);
	}

	_showZone(map: mapboxgl.Map) {
		const MAX_ZONE = 3;
		getGameDocRef().onSnapshot(
			snap => {
				const game = snap.data();
				if (game) {
					const phase = game.phase || 0;
					const zoneNum = phase > MAX_ZONE ? MAX_ZONE : phase; // Set zoneNum to phase or MAX_ZONE
					map.setFilter('zone', ['==', 'zone', zoneNum]);
					map.setFilter('zone-border', ['==', 'zone', zoneNum]);
				}
			},
			err => console.error('At _showZone(): ', err)
		);
	}

	_addControls(map: mapboxgl.Map) {
		if (this.props.isAdmin) {
			const phaseControl = new PhaseSelectControl();
			map.addControl(phaseControl, 'top-left');
			const roleSelectControl = new RoleSelectControl();
			map.addControl(roleSelectControl, 'top-left');
			$('.ui.dropdown').dropdown();
		}

		addGeolocateControl(map);
		const navigationControl = new NavigationControl({ showZoom: false });
		map.addControl(navigationControl, 'top-right');
		const legendControl = new LegendControl();
		map.addControl(legendControl, 'top-right');
	}

	_onLongPress(e: mapboxgl.MapMouseEvent & mapboxgl.EventData) {
		const { point, lngLat } = e;
		const { lat, lng: long } = lngLat;
		this._drawRipple(point.x, point.y);
		if (this.props.isWaitingForLocation)
			document.dispatchEvent(
				createLocationselectEvent({
					coords: {
						lat,
						long,
					},
				})
			);
		else this._chooseDestination(lat, long);
	}

	/**
	 * Listen to contextmenu or long-press for IOS
	 */
	_listenToLongPress(
		map: mapboxgl.Map,
		listener: (ev: mapboxgl.MapMouseEvent & mapboxgl.EventData) => void
	) {
		if (isIOS()) init_ios_context_menu(map);
		map.on('contextmenu', listener);
	}

	_chooseDestination(lat: number, long: number) {
		this.props.changeDestination({ latitude: lat, longitude: long });
	}

	_drawRipple(x: number, y: number) {
		// prettier-ignore
		const node = (ReactDOM.findDOMNode(this)! as Element).querySelector('#ripple')!;
		const newNode = node.cloneNode(true) as HTMLElement;
		newNode.classList.add(styles.animate);
		newNode.style.left = x - 5 + 'px';
		newNode.style.top = y - 5 + 'px';
		node.parentNode!.replaceChild(newNode, node);
	}

	_showChaserPoints(map: mapboxgl.Map) {
		const gameDoc = getGameDocRef();
		gameDoc.onSnapshot(
			snap => {
				const game = snap.data();
				if (game) {
					const chaserSeq = game['chaser_sequence_num'] || 0;

					// prettier-ignore
					map.setFilter('chaser-points', ['has', `sequence_${chaserSeq}`]);
					map.setLayoutProperty('chaser-points', 'visibility', 'visible');
				}
			},
			err => console.error(new Error('Getting game doc'), err)
		);
	}

	/**
	 * Set up listeners to hide collected points and show points based on player's role
	 */
	_showIntelligenceAndDetectivePoints(map: mapboxgl.Map, role?: PlayerRole) {
		if (this.props.isAdmin) {
			// Hide collected points for all roles
			const roles = ['detective', 'intelligence'] as Exclude<
				PlayerRole,
				'chaser'
			>[];
			roles.forEach(role => {
				let layerId = role + '-points';
				this._hideCollectedPoints(map, layerId, role);
			});
		} else {
			// Show points related to player's role and hide colleted ones
			getCurrentPlayer()
				.then(player => {
					if (player && player.role !== 'chaser') {
						let layerId = player.role + '-points';
						this._hideCollectedPoints(map, layerId, player.role);
						this._savePointsToSession(map, layerId);
						map.setLayoutProperty(layerId, 'visibility', 'visible');
					}
				})
				.catch(err =>
					console.error(new Error('Getting current player data from db'), err)
				);
		}
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
		playerRole: Exclude<PlayerRole, 'chaser'>
	) {
		getGameDocRef().onSnapshot(
			snapshot => {
				const game = snapshot.data();
				let pointType = playerRole;

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

	_markPlayerLocations: (() => void) | undefined = undefined;

	_markPlayerLocationsWrapper = (map: mapboxgl.Map) => () => {
		const playerLocationMarkers: GeoJSON.Feature<GeoJSON.Geometry>[] = [];
		for (let uid in this.props.playerLocations) {
			const { latitude, longitude, playerName } = this.props.playerLocations[
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
		if (!map.getSource('player-locations'))
			// First time - set new source
			this._setLayerSource(
				'player-locations',
				{ type: 'FeatureCollection', features: playerLocationMarkers },
				map
			);
		else {
			// Update source data
			const source = map.getSource('player-locations') as GeoJSONSource;
			source.setData({
				type: 'FeatureCollection',
				features: playerLocationMarkers,
			});
		}
	};

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
				onMove={this.props.onMove}
				onStyleLoad={this._onStyleLoad}
			/>
		);
	};
}

const mapState = (state: ReduxState) => ({
	isAdmin: state.main.isAdmin,
	playerLocations: state.map.playerLocations,
	isWaitingForLocation: state.map.isWaitingForLocation,
});
const mapActions = {
	changeDestination,
	setPlayerLocations,
};
export default connect(mapState, mapActions)(MapTabContainer);

/**
 * @author Petr Nagy
 * @link https://stackoverflow.com/a/54746189
 */
function init_ios_context_menu(map: mapboxgl.Map) {
	let iosTimeout: any = null;
	let clearIosTimeout = () => {
		clearTimeout(iosTimeout);
	};

	map.on('touchstart', e => {
		if (e.originalEvent.touches.length > 1) {
			return;
		} else {
			iosTimeout = setTimeout(() => {
				// show_context_menu_or_whatever(e);
				map.fire('contextmenu', e);
			}, 500);
		} // end if-else
	});

	[
		'touchend',
		'touchcancel',
		'touchmove',
		'pointerdrag',
		'pointermove',
		'moveend',
		'gesturestart',
		'gesturechange',
		'gestureend',
	].forEach(e => {
		map.on(e, clearIosTimeout);
	});
}
