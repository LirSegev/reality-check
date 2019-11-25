import * as React from 'react';
import TargetTabView, { Props as ViewProps } from './Target.tab.view';

export interface State {
	selectedSuspect: number | null;
	suspectList: number[];
}

type Props = Omit<
	ViewProps,
	'updateSuspectList' | 'suspectList' | 'selectSuspect' | 'selectedSuspect'
>;

class TargetTabContainer extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			selectedSuspect: null,
			suspectList: [],
		};

		this._updateSuspectList = this._updateSuspectList.bind(this);
		this._selectSuspect = this._selectSuspect.bind(this);
	}

	_updateSuspectList(suspectList: State['suspectList']) {
		this.setState({
			suspectList,
		});
	}

	_selectSuspect(id: State['selectedSuspect']) {
		this.setState({ selectedSuspect: id });
	}

	render() {
		return (
			<TargetTabView
				{...this.props}
				updateSuspectList={this._updateSuspectList}
				selectSuspect={this._selectSuspect}
				{...this.state}
			/>
		);
	}
}

export default TargetTabContainer;
