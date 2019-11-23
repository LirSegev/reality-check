import React from 'react';

import TabbarView from './Tabbar.view';

interface Props {
	tabs: {
		tabTitle: string;
		content: JSX.Element;
	}[];
	index?: number;
	onChange?: (e: { index: number }) => void;
}

interface State {
	index: number;
}

class TabbarContainer extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			index: props.index || 0,
		};

		this._handleClick = this._handleClick.bind(this);
	}

	componentDidUpdate(prevProps: Props, prevState: State) {
		const index = this.props.index;
		if (index !== undefined) {
			if (index !== prevProps.index) this.setState({ index });

			if (index !== prevState.index && this.props.onChange)
				this.props.onChange({ index });
		}
	}

	_handleClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
		const index = Number(e.currentTarget.dataset.index);

		this.setState({ index });
	}

	render() {
		return (
			<TabbarView
				tabs={this.props.tabs}
				index={this.state.index}
				handleClick={this._handleClick}
			/>
		);
	}
}

export default TabbarContainer;
