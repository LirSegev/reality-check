import React from 'react';
import MapTabView from './Map.tab.view';
import * as firebase from 'firebase/app';
import { IntelItem } from '../../intel/Intel.d';
import {
	onShowTransportOnMapWrapper,
	// addTransportRoutesLayer,
} from './transport.module';
import { addGeolocateControl } from './geolocateControl.module';
import { getCurrentPlayer, getGameDocRef } from '../../../../util/db';
import { NavigationControl } from 'mapbox-gl';
import { ReduxState } from '../../../../reducers/initialState';
import { connect } from 'react-redux';
import { isIOS } from '../../../../util/general';
import ReactDOM from 'react-dom';
import { changeDestination } from '../../../../reducers/map.reducer';
import { changeDestinationActionPayload } from '../../../../reducers/map.reducer.d';
import styles from './Map.module.css';
import RoleSelectControl from './roleSelectControl.module';

// @ts-ignore
const $ = window.$ as JQueryStatic;

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
	isAdmin: boolean;
	onMove: (map: mapboxgl.Map) => void;
	changeDestination: (payload: changeDestinationActionPayload) => void;
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
		this._chooseDestination = this._chooseDestination.bind(this);
	}

	componentDidMount() {
		getGameDocRef()
			.collection('players')
			.onSnapshot(this._updatePlayerLocations, err =>
				console.error(new Error('Error getting player list'), err)
			);

		getGameDocRef()
			.collection('intel')
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
		this._listenToSetDestination(map);

		if (this.props.isAdmin) {
			const roleSelectControl = new RoleSelectControl();
			map.addControl(roleSelectControl, 'top-left');
			$('.ui.dropdown').dropdown();
		}

		addGeolocateControl(map);

		const navigationControl = new NavigationControl({ showZoom: false });
		map.addControl(navigationControl, 'top-right');

		document.addEventListener(
			'show-transport-on-map',
			onShowTransportOnMapWrapper(map)
		);
	}

	/**
	 * Listen to contextmenu or long-press for IOS
	 */
	_listenToSetDestination(map: mapboxgl.Map) {
		if (isIOS()) init_ios_context_menu(map);
		map.on('contextmenu', this._chooseDestination);
	}

	_chooseDestination(e: mapboxgl.MapMouseEvent & mapboxgl.EventData) {
		const { lat, lng } = e.lngLat;
		this._drawRipple(e);
		this.props.changeDestination({ latitude: lat, longitude: lng });
	}

	_drawRipple(e: mapboxgl.MapMouseEvent & mapboxgl.EventData) {
		const { x, y } = e.point;
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
	 * Show role specific layers on map.
	 * Show intelligence points to intelligence collector and so on.
	 */
	_showRolePoints(map: mapboxgl.Map) {
		if (!this.props.isAdmin)
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
				onMove={this.props.onMove}
				onStyleLoad={this._onStyleLoad}
			/>
		);
	};
}

const mapState = (state: ReduxState) => ({
	isAdmin: state.main.isAdmin,
});
const mapActions = {
	changeDestination,
};
export default connect(
	mapState,
	mapActions
)(MapTabContainer);

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
	map.on('touchend', clearIosTimeout);
	map.on('touchcancel', clearIosTimeout);
	map.on('touchmove', clearIosTimeout);
	map.on('pointerdrag', clearIosTimeout);
	map.on('pointermove', clearIosTimeout);
	map.on('moveend', clearIosTimeout);
	map.on('gesturestart', clearIosTimeout);
	map.on('gesturechange', clearIosTimeout);
	map.on('gestureend', clearIosTimeout);
}
