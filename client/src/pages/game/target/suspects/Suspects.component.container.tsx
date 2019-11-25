import React from 'react';
import * as firebase from 'firebase/app';
import SuspectsView from './Suspects.component.view';
import { ReduxState } from '../../../../reducers/initialState';
import { connect } from 'react-redux';
import { getGameDocRef } from '../../../../util/db';

interface State {
	showId: number | undefined;
	suspectList: number[];
}

/**
 * The time interval in seconds between switching to next suspect pic.
 */
const CHANGE_PHOTO_INTERVAL = 2;

class SuspectsContainer extends React.Component<{}, State> {
	constructor(props: {}) {
		super(props);

		this.state = { showId: undefined, suspectList: [] };

		this._updateSuspectList = this._updateSuspectList.bind(this);
		this._switch2NextPic = this._switch2NextPic.bind(this);
	}

	componentDidMount() {
		getGameDocRef().onSnapshot(this._updateSuspectList, err =>
			console.error(new Error('Getting game snapshot'), err)
		);
	}

	_updateSuspectList(snapshot: firebase.firestore.DocumentSnapshot) {
		const game = snapshot.data();
		if (game && game['suspect_list'])
			this.setState(prevState => ({
				...prevState,
				// TODO: Remove .map() when sure suspect_list is number[]
				suspectList: game['suspect_list'].map((val: any) => Number(val)),
			}));
	}

	componentDidUpdate(prevProps: {}, prevState: State) {
		// prettier-ignore
		if (JSON.stringify(this.state.suspectList) !== JSON.stringify(prevState.suspectList)) {
			// state.suspectList has changed

			// Set showId to first suspect
			this.setState(prev => ({
				...prev,
				showId: this.state.suspectList[0],
			}));

			if(this._interval)
				clearInterval(this._interval);
			this._interval = setInterval(this._switch2NextPic, CHANGE_PHOTO_INTERVAL * 1000);
		}
	}

	/**
	 * Set showId to next suspect
	 */
	_switch2NextPic() {
		this.setState(prev => {
			if (prev.showId !== undefined) {
				const indexOfPrev = this.state.suspectList.indexOf(prev.showId);
				const suspectList = this.state.suspectList;
				return {
					...prev,
					showId: suspectList[(indexOfPrev + 1) % suspectList.length],
				};
			} else return prev; // Do not change state
		});
	}

	_handleClick(e: React.MouseEvent<HTMLImageElement, MouseEvent>) {
		window.open(`suspects_stories/${e.currentTarget.dataset.suspect_id}.pdf`);
	}

	componentWillUnmount() {
		if (this._interval) clearInterval(this._interval);
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
