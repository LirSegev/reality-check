import * as React from 'react';
import TargetTabView, { Props as ViewProps } from './Target.tab.view';
import { ReduxState } from '../../../reducers/initialState';
import { connect } from 'react-redux';

export interface State {
	selectedSuspect: number | undefined;
	suspectList: number[];
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
		};

		this._updateSuspectList = this._updateSuspectList.bind(this);
		this._selectSuspect = this._selectSuspect.bind(this);
		this._onTabChange = this._onTabChange.bind(this);
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
		this._selectSuspect(this.state.suspectList[e.index - 1]);
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
