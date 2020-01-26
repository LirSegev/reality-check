import React from 'react';
import ReactDOM from 'react-dom';

import TabbarView from './Tabbar.view';

interface Props {
	tabs: NonEmptyArray<{
		tabTitle: string;
		content: JSX.Element;
		className?: string;
	}>;
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

	_barRef = React.createRef<HTMLDivElement>();
	componentDidMount() {
		this._barRef.current?.addEventListener('touchstart', e => {
			e.stopPropagation();
		});
	}

	componentDidUpdate(prevProps: Props, prevState: State) {
		const propsIndex = this.props.index;
		if (propsIndex !== undefined && propsIndex !== prevProps.index)
			this._changeTab(propsIndex);
	}

	_handleClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
		const index = Number(e.currentTarget.dataset.index);
		this._changeTab(index);
	}

	_changeTab(index: number) {
		this.setState({
			index,
		});

		// prettier-ignore
		const tabEl = (ReactDOM.findDOMNode(this) as Element)
			.querySelector( `[data-index="${index}"]` )!
		// @ts-ignore
		if (tabEl.scrollIntoViewIfNeeded) tabEl.scrollIntoViewIfNeeded(); // TODO: test with IOS

		if (this.props.onChange) this.props.onChange({ index });
	}

	render() {
		return (
			<TabbarView
				tabs={this.props.tabs}
				index={this.state.index}
				handleClick={this._handleClick}
				barRef={this._barRef}
			/>
		);
	}
}

export default TabbarContainer;
