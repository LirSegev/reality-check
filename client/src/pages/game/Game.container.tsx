import * as firebase from 'firebase/app';
import produce from 'immer';
import * as React from 'react';
import { connect } from 'react-redux';

import { ReduxState } from '../../reducers/initialState';
import {
	changeOpTab,
	changeTab,
	stopLoading,
} from '../../reducers/main.reducer';
import { changeMapOrientation } from '../../reducers/map.reducer';
import { updateCurrentPlayer } from '../../util/db';
import collectClosePoints from './collectPoints.module';
import GameView from './Game.view';
import * as t from 'io-ts';
import { fold, left } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';
import { PathReporter } from 'io-ts/lib/PathReporter';

/**
 * The time interval in seconds to check if the player is close enough to a
 * detective/intelligence point in order to collect it.
 */
const CHECK_FOR_POINTS_INTERVAL = 5;

/**
 * Time interval in seconds for updating player's geolocation in db.
 */
const LOCATION_UPDATES_INTERVAL = 10;

interface Props {
	stopLoading: ConnectedAction<typeof stopLoading>;
	changeTab: ConnectedAction<typeof changeTab>;
	changeOpTab: ConnectedAction<typeof changeOpTab>;
	changeMapOrientation: ConnectedAction<typeof changeMapOrientation>;
	isAdmin: boolean;
	tabIndex: number;
	opTabIndex: number;
}
interface State {
	unreadNums: {
		chat: number;
		intel: number;
		target: number;
	};
}

class GameContainer extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			unreadNums: {
				chat: 0,
				intel: 0,
				target: 0,
			},
		};

		this._onMapMove = this._onMapMove.bind(this);
		this._onTabChange = this._onTabChange.bind(this);
		this._onGPSMove = this._onGPSMove.bind(this);
		this._incrementUnreadNum = this._incrementUnreadNum.bind(this);
		this._resetUnreadNum = this._resetUnreadNum.bind(this);
	}

	/**
	 * Increments unreadNum depending on `type`
	 * @return true if incremented or false if canceled because of the current tab index
	 */
	_incrementUnreadNum(type: 'chat' | 'intel' | 'target'): boolean {
		const { tabIndex, opTabIndex } = this.props;
		if (
			(type === 'chat' && tabIndex === 2 && opTabIndex === 1) ||
			(type === 'intel' && tabIndex === 1) ||
			(type === 'target' && tabIndex === 0)
		)
			return false;

		this.setState((prevState: State) => {
			return produce(prevState, draft => {
				draft.unreadNums[type] = prevState.unreadNums[type] + 1;
			});
		});
		return true;
	}

	_resetUnreadNum(type: UnreadType) {
		this.setState((prevState: State) => {
			return produce(prevState, draft => {
				draft.unreadNums[type] = 0;
			});
		});
	}

	// TODO: move method to Map component
	_onMapMove(map: mapboxgl.Map) {
		const bounds = map.getBounds();
		this.props.changeMapOrientation({
			center: {
				longitude: map.getCenter().lng,
				latitude: map.getCenter().lat,
			},
			bearing: map.getBearing(),
			zoom: map.getZoom(),
			bounds: {
				north: bounds.getNorth(),
				south: bounds.getSouth(),
				west: bounds.getWest(),
				east: bounds.getEast(),
			},
		});
	}

	_GPSWatchId: number | undefined = undefined;

	componentDidMount() {
		this.props.stopLoading();

		if (navigator.geolocation && !this.props.isAdmin)
			navigator.geolocation.getCurrentPosition(pos => {
				this._updateLastPos(pos);
				// TODO: clear all intervals at componentWillUnmount()
				// Update player location in db
				setInterval(() => {
					if (this._lastPos) this._updatePlayerLocation(this._lastPos);
				}, LOCATION_UPDATES_INTERVAL * 1000);

				// Collect detective/intelligence points
				setInterval(() => {
					if (this._lastPos) collectClosePoints(this._lastPos);
				}, CHECK_FOR_POINTS_INTERVAL * 1000);
			});

		this._GPSWatchId = navigator.geolocation.watchPosition(this._onGPSMove);
	}

	componentWillUnmount() {
		if (this._GPSWatchId) navigator.geolocation.clearWatch(this._GPSWatchId);
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

	_onTabChange = (event: unknown) => {
		const Event = t.type(
			{
				index: t.number,
			},
			'TabChangeEvent'
		);

		fold<t.Errors, t.TypeOf<typeof Event>, unknown>(
			err => pipe(left(err), PathReporter.report, console.error),
			e => {
				if (e.index !== this.props.tabIndex) this.props.changeTab(e.index);
				switch (e.index) {
					case 2:
						if (this.props.opTabIndex === 1) this._resetUnreadNum('chat');
						break;
					case 1:
						this._resetUnreadNum('intel');
						break;
					case 0:
						this._resetUnreadNum('target');
				}
			}
		)(Event.decode(event));
	};

	_onOpTabChange = (event: any) => {
		event.stopPropagation();
		if (event.index !== this.props.opTabIndex)
			this.props.changeOpTab(event.index);
		if (event.index === 1) this._resetUnreadNum('chat');
	};

	render() {
		return (
			<GameView
				unreadNums={this.state.unreadNums}
				incrementUnreadNum={this._incrementUnreadNum}
				onOpTabChange={this._onOpTabChange}
				onTabChange={this._onTabChange}
				onMapMove={this._onMapMove}
			/>
		);
	}
}

const mapDispatchToProps = {
	stopLoading,
	changeTab,
	changeOpTab,
	changeMapOrientation,
};
const mapState = (state: ReduxState) => {
	const { main } = state;
	const { isAdmin, tabIndex, opTabIndex } = main;
	return { isAdmin, tabIndex, opTabIndex };
};
export default connect(mapState, mapDispatchToProps)(GameContainer);
