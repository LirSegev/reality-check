import * as React from 'react';
import Game from '../game';
import ChooseGamePage from './chooseGame/index';

interface Props {
	stopLoading: () => void;
	gameId: string | null;
}

class Admin extends React.Component<Props> {
	render() {
		const { gameId, stopLoading } = this.props;
		if (gameId)
			return <Game stopLoading={stopLoading} gameId={gameId as string} />;
		else return <ChooseGamePage stopLoading={stopLoading} />;
	}
}

export default Admin;
