import * as React from 'react';
import TargetTabView, { Props as ViewProps } from './Target.tab.view';
import { ReduxState } from '../../../reducers/initialState';
import { connect } from 'react-redux';
import { getGameDocRef } from '../../../util/db';

/**
 * List of usable suspects
 */
export const AVAIL_SUSPECTS: number[] = [100, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

export interface State {
	selectedSuspect: number | undefined;
	suspectList: number[];
	hiddenSuspects: number[];
	markedSuspects: number[];
}

interface Props
	extends Omit<
		ViewProps,
		| 'updateSuspectList'
		| 'suspectList'
		| 'selectSuspect'
		| 'selectedSuspect'
		| 'onTabChange'
		| 'isVisible'
		| 'markedSuspects'
		| 'hiddenSuspects'
	> {
	tabIndex: number;
	visibleTabIndex: number;
}

class TargetTabContainer extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			selectedSuspect: undefined,
			suspectList: [],
			hiddenSuspects: [],
			markedSuspects: [],
		};

		this._updateSuspectList = this._updateSuspectList.bind(this);
		this._selectSuspect = this._selectSuspect.bind(this);
		this._onTabChange = this._onTabChange.bind(this);
	}

	componentDidMount() {
		getGameDocRef().onSnapshot(snap => {
			const game = snap.data() as DB.GameDoc;
			this.setState({
				markedSuspects: game?.marked_suspects ?? [],
				hiddenSuspects: game?.hidden_suspects ?? [],
			});
		});
	}

	_updateSuspectList(suspectList: State['suspectList']) {
		this.setState({
			suspectList,
		});
	}

	_selectSuspect(id: State['selectedSuspect']) {
		this.setState({ selectedSuspect: id });
	}

	_onTabChange(e: { index: number }) {
		this._selectSuspect(AVAIL_SUSPECTS[e.index - 1]);
	}

	render() {
		return (
			<TargetTabView
				{...this.props}
				updateSuspectList={this._updateSuspectList}
				selectSuspect={this._selectSuspect}
				onTabChange={this._onTabChange}
				isVisible={this.props.visibleTabIndex === this.props.tabIndex}
				{...this.state}
			/>
		);
	}
}

const mapState = (state: ReduxState) => ({
	visibleTabIndex: state.main.tabIndex,
});
export default connect(mapState)(TargetTabContainer);
