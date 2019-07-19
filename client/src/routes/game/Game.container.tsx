import * as React from 'react';
import GameView from './Game.view';

interface Props {
	gameId: string;
	stopLoading: () => void;
}

class GameContainer extends React.Component<Props> {
	componentDidMount() {
		this.props.stopLoading();
	}

	render() {
		return <GameView />;
	}
}

export default GameContainer;
