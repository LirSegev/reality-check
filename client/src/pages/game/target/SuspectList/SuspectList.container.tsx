import React from 'react';
import SuspectListView from './SuspectList.view';

interface Props {
	suspectList: number[];
	selectSuspect: (id: number) => void;
}
interface State {
	isOpen: boolean;
}

class SuspectListContainer extends React.Component<Props, State> {
	state = {
		isOpen: false,
	};

	_closeList = () => {
		this.setState({
			isOpen: false,
		});
	};

	_openList = () => {
		this.setState({
			isOpen: true,
		});
	};

	_handleSuspectClick = (e: React.MouseEvent<any, MouseEvent>) => {
		const id = Number(e.currentTarget.dataset.suspect_id as string | undefined);
		if (id) {
			this.props.selectSuspect(id);
			this._closeList();
		}
	};

	render = () => {
		const {
			props,
			state,
			_closeList: closeList,
			_openList: openList,
			_handleSuspectClick: handleSuspectClick,
		} = this;
		const { suspectList } = props;
		const { isOpen } = state;
		return (
			<SuspectListView
				{...{ suspectList, isOpen, closeList, openList, handleSuspectClick }}
			/>
		);
	};
}

export default SuspectListContainer;
//
