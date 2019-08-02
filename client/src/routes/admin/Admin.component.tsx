import * as React from 'react';
import ChooseGamePage from './chooseGame/index';

interface Props {
	stopLoading: () => void;
	changeGame: (gameId: string | null) => void;
}

class Admin extends React.Component<Props> {
	render() {
		const { stopLoading, changeGame } = this.props;
		return <ChooseGamePage stopLoading={stopLoading} changeGame={changeGame} />;
	}
}

export default Admin;
