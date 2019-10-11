import React from 'react';
import SuspectsView from './Suspects.component.view';

interface State {
	showId: number | undefined;
	suspectList: number[];
}

/**
 * The time interval in seconds between switching to next suspect pic.
 */
const CHANGE_PHOTO_INTERVAL = 1;

class SuspectsContainer extends React.Component<{}, State> {
	constructor(props: {}) {
		super(props);

		this.state = { showId: undefined, suspectList: [] };
	}

	componentDidUpdate(prevProps: {}, prevState: State) {
		// prettier-ignore
		if (JSON.stringify(this.state.suspectList) !== JSON.stringify(prevState.suspectList)) {
			// state.suspectList as changed

			// Set showId to first suspect
			this.setState(prev => ({
				...prev,
				showId: this.state.suspectList[0],
			}));

			this._interval = setInterval(() => {
				// Set showId to next suspect
				this.setState(prev => {
					if (prev.showId) {
						const indexOfPrev = this.state.suspectList.indexOf(prev.showId);
						const suspectList = this.state.suspectList;
						return {
							...prev,
							showId: suspectList[(indexOfPrev + 1) % suspectList.length],
						};
					} else return prev;
				});
			}, CHANGE_PHOTO_INTERVAL * 1000);
		}
	}

	componentWillUpdate(prevProps: {}, prevState: State) {
		// prettier-ignore
		if (JSON.stringify(this.state.suspectList) !== JSON.stringify(prevState.suspectList)) {
			// state.suspectList as changed

			if(this._interval)
				clearInterval(this._interval);
		}
	}

	_interval: any = undefined;

	render() {
		return <SuspectsView showId={this.state.showId} />;
	}
}

export default SuspectsContainer;
