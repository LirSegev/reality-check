import * as React from 'react';
import GameView from './Game.view';
import * as firebase from 'firebase/app';
import { updateCurrentPlayer } from '../../util/db';
import collectClosePoints from './collectPoints.module';

/**
 * The time interval in seconds to check if the player is close enough to a
 * identity/intelligence point in order to collect it.
 */
const CHECK_FOR_POINTS_INTERVAL = 5;

/**
 * Time interval in seconds for updating player's geolocation in db.
 */
const LOCATION_UPDATES_INTERVAL = 10;

interface Props {
	gameId: string;
	isAdmin: boolean;
	stopLoading: () => void;
}

interface State {
	mapOrientation: MapOrientation;
	tabIndex: number;
	opTabIndex: number;
}

class GameContainer extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			mapOrientation: {
				center: { longitude: 14.42, latitude: 50.08 },
				zoom: 12,
			},
			tabIndex: 2,
			opTabIndex: 0,
		};

		this._onMapMove = this._onMapMove.bind(this);
		this._onTabChange = this._onTabChange.bind(this);
		this._moveToLocationOnMap = this._moveToLocationOnMap.bind(this);
		this._onGPSMove = this._onGPSMove.bind(this);
		this._moveToMapTab = this._moveToMapTab.bind(this);
	}

	_onMapMove(map: mapboxgl.Map) {
		this.setState(prevState => ({
			mapOrientation: {
				...prevState.mapOrientation,
				center: {
					longitude: map.getCenter().lng,
					latitude: map.getCenter().lat,
				},
				zoom: map.getZoom(),
			},
		}));
	}

	_moveToLocationOnMap(long: number, lat: number, zoom?: number) {
		this.setState(prevState => ({
			mapOrientation: {
				...prevState.mapOrientation,
				center: {
					longitude: long,
					latitude: lat,
				},
				zoom: zoom ? zoom : prevState.mapOrientation.zoom,
			},
			tabIndex: 2,
			opTabIndex: 0,
		}));
	}

	_moveToMapTab() {
		this.setState({
			tabIndex: 2,
			opTabIndex: 0,
		});
	}

	_GPSWatchId: number | undefined = undefined;

	componentDidMount() {
		this.props.stopLoading();

		if (navigator.geolocation)
			navigator.geolocation.getCurrentPosition(pos => {
				this._updateLastPos(pos);
				// Update player location in db
				setInterval(() => {
					if (this._lastPos) this._updatePlayerLocation(this._lastPos);
				}, LOCATION_UPDATES_INTERVAL * 1000);

				// Collect identity/intelligence points
				setInterval(() => {
					if (this._lastPos) collectClosePoints(this._lastPos);
				}, CHECK_FOR_POINTS_INTERVAL * 1000);
			});

		this._GPSWatchId = navigator.geolocation.watchPosition(this._onGPSMove);
	}

	componentWillUnmount() {
		navigator.geolocation.clearWatch(this._GPSWatchId!);
	}

	_lastPos: Position | null = null;

	_onGPSMove(pos: Position) {
		this._updateLastPos(pos);
	}

	_updateLastPos(pos: Position) {
		this._lastPos = pos;
	}

	_updatePlayerLocation(pos: Position) {
		const { latitude, longitude } = pos.coords;

		const data = {
			location: {
				geopoint: new firebase.firestore.GeoPoint(latitude, longitude),
				timestamp: new firebase.firestore.Timestamp(
					Math.round(pos.timestamp / 1000),
					0
				),
			},
		};

		updateCurrentPlayer(data).catch(err =>
			console.error(new Error('Error updating player location:'), err)
		);
	}

	_onTabChange = (event: any) => this.setState({ tabIndex: event.index });

	_onOpTabChange = (event: any) => {
		event.stopPropagation();
		this.setState({ opTabIndex: event.index });
	};

	render() {
		return (
			<GameView
				opTabIndex={this.state.opTabIndex}
				onOpTabChange={this._onOpTabChange}
				onTabChange={this._onTabChange}
				moveToLocationOnMap={this._moveToLocationOnMap}
				tabIndex={this.state.tabIndex}
				mapOrientation={this.state.mapOrientation}
				onMapMove={this._onMapMove}
				isAdmin={this.props.isAdmin}
				gameId={this.props.gameId}
				moveToMapTab={this._moveToMapTab}
			/>
		);
	}
}

export default GameContainer;
