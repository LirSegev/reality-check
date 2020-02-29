import React from 'react';
import DialogWithButtonView from './DialogWithButton.view';

interface State {
	isOpen: boolean;
}
interface Props {
	button: JSX.Element;
	content?: JSX.Element;
}

class DialogWithButtonContainer extends React.Component<Props, State> {
	state: State = {
		isOpen: false,
	};

	_open = () => {
		this.setState({
			isOpen: true,
		});
	};

	_close = () => {
		this.setState({
			isOpen: false,
		});
	};

	render() {
		return (
			<DialogWithButtonView
				isOpen={this.state.isOpen}
				openList={this._open}
				closeList={this._close}
				button={this.props.button}
				content={this.props.content ?? this.props.children}
			/>
		);
	}
}

export default DialogWithButtonContainer;
