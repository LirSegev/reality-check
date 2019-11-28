import * as firebase from 'firebase/app';
import * as React from 'react';
import { connect } from 'react-redux';

import { ReduxState } from '../../reducers/initialState';
import { changeGame, stopLoading } from '../../reducers/main.reducer';
import ChooseGamePageView from './ChooseGame.page.view';
import renderGameItem from './renderGameItem';

interface Props {
	stopLoading: ConnectedAction<typeof stopLoading>;
	changeGame: ConnectedAction<typeof changeGame>;
}
interface State {
	gameList: string[];
}

class ChooseGamePageContainer extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			gameList: [],
		};
	}

	_renderGameItem = renderGameItem(this.props.changeGame);

	componentWillMount() {
		const db = firebase.firestore();
		db.collection('games')
			.get()
			.then(games => {
				games.forEach(game => {
					this.setState(prevState => ({
						gameList: [...prevState.gameList, game.id],
					}));
				});
				this.props.stopLoading();
			})
			.catch(err => console.error(new Error('Error getting game list:'), err));
	}

	render = () => (
		<ChooseGamePageView
			renderGameItem={this._renderGameItem}
			gameList={this.state.gameList}
		/>
	);
}

const mapState = (state: ReduxState) => ({
	gameId: state.main.gameId,
});
const mapDispatch = {
	changeGame,
	stopLoading,
};
export default connect(mapState, mapDispatch)(ChooseGamePageContainer);
