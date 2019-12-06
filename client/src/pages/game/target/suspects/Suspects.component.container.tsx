import * as firebase from 'firebase/app';
import React from 'react';

import { getGameDocRef } from '../../../../util/db';
import SuspectsView from './Suspects.component.view';

interface State {
	showId: number | undefined;
}

interface Props {
	selectedSuspect: number | undefined;
	selectSuspect: (id: Props['selectedSuspect']) => void;
	suspectList: number[];
	updateSuspectList: (suspectList: Props['suspectList']) => void;
	isVisible: boolean;
}

const CHANGE_PHOTO_INTERVAL_MIN = 200;
const CHANGE_PHOTO_INTERVAL_MAX = 2000;
const PHOTO_LOOP_CYCLE_DURATION = 8000;

class SuspectsContainer extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = { showId: undefined };

		this._updateSuspectList = this._updateSuspectList.bind(this);
		this._switch2NextPic = this._switch2NextPic.bind(this);
		this._handleClick = this._handleClick.bind(this);
	}

	componentDidMount() {
		getGameDocRef().onSnapshot(this._updateSuspectList, err =>
			console.error(new Error('Getting game snapshot'), err)
		);
	}

	_updateSuspectList(snapshot: firebase.firestore.DocumentSnapshot) {
		const game = snapshot.data() as DB.GameDoc | undefined;
		if (game && game['suspect_list'])
			// TODO: Remove .map() when sure suspect_list is number[]
			this.props.updateSuspectList(
				game['suspect_list'].map(val => Number(val))
			);
	}

	componentDidUpdate(prevProps: Props) {
		//* selectedSuspect changed
		if (prevProps.selectedSuspect !== this.props.selectedSuspect) {
			if (this.props.selectedSuspect) {
				this._stopSwitchingPics();
				this.setState({ showId: this.props.selectedSuspect });
			} else {
				const { suspectList } = this.props;
				const indexOfCurr = suspectList.indexOf(prevProps.selectedSuspect!);
				const indexOfNext = (indexOfCurr + 1) % suspectList.length;

				this._startSwitchingPicsWhenVisible(indexOfNext);
			}
		}

		//* suspectList changed and no selectedSuspect
		if (
			!this.props.selectedSuspect &&
			JSON.stringify(this.props.suspectList) !==
				JSON.stringify(prevProps.suspectList)
		) {
			this._startSwitchingPicsWhenVisible();
		}

		//* isVisible changed and no selectedSuspect
		if (
			this.props.isVisible !== prevProps.isVisible &&
			!this.props.selectedSuspect
		) {
			this._toggleSwitchingPics();
		}
	}

	_toggleSwitchingPics() {
		if (this._interval) this._pauseSwitchingPics();
		else {
			if (this._nextStartSwitchingPicsArgs)
				this._startSwitchingPics(...this._nextStartSwitchingPicsArgs);
			else this._startSwitchingPics();
		}
	}

	_indexPausedOn?: number = undefined;
	_pauseSwitchingPics() {
		this._stopSwitchingPics();
		if (this.state.showId)
			this._indexPausedOn = this.props.suspectList.indexOf(this.state.showId);
	}

	_nextStartSwitchingPicsArgs?: [number?] = undefined;
	_startSwitchingPicsWhenVisible(
		this: SuspectsContainer,
		...args: Parameters<typeof this._startSwitchingPics>
	) {
		if (this.props.isVisible) this._startSwitchingPics(...args);
		else this._nextStartSwitchingPicsArgs = args;
	}

	_startSwitchingPics(startIndex: number = this._indexPausedOn || 0) {
		this._indexPausedOn = undefined;
		const { suspectList } = this.props;

		// Set showId to first suspect
		this.setState(prev => ({
			...prev,
			showId: suspectList[startIndex],
		}));

		let changePhotoInterval = PHOTO_LOOP_CYCLE_DURATION / suspectList.length;
		if (changePhotoInterval < CHANGE_PHOTO_INTERVAL_MIN)
			changePhotoInterval = CHANGE_PHOTO_INTERVAL_MIN;
		else if (changePhotoInterval > CHANGE_PHOTO_INTERVAL_MAX)
			changePhotoInterval = CHANGE_PHOTO_INTERVAL_MAX;

		this._stopSwitchingPics();
		this._interval = setInterval(this._switch2NextPic, changePhotoInterval);
	}

	_stopSwitchingPics() {
		if (this._interval) clearInterval(this._interval);
		this._interval = undefined;
	}

	/**
	 * Set showId to next suspect
	 */
	_switch2NextPic() {
		this.setState(prev => {
			if (prev.showId !== undefined) {
				const indexOfPrev = this.props.suspectList.indexOf(prev.showId);
				const suspectList = this.props.suspectList;
				return {
					...prev,
					showId: suspectList[(indexOfPrev + 1) % suspectList.length],
				};
			} else return prev; // Do not change state
		});
	}

	_handleClick(e: React.MouseEvent<HTMLImageElement, MouseEvent>) {
		this.props.selectSuspect(Number(e.currentTarget.dataset.suspect_id!));
	}

	componentWillUnmount() {
		this._stopSwitchingPics();
	}

	_interval: any = undefined;

	render() {
		return (
			<SuspectsView
				showId={this.state.showId}
				handleClick={this._handleClick}
			/>
		);
	}
}

export default SuspectsContainer;
