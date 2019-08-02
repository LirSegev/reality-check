import * as React from 'react';
import ChooseGamePageView from './ChooseGame.page.view';
import * as firebase from 'firebase/app';
import renderGameItem from './renderGameItem';

interface Props {
	stopLoading: () => void;
	changeGame: (gameId: string | null) => void;
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

		this._renderGameItem = this._renderGameItem(props.changeGame);
	}

	_renderGameItem: any = renderGameItem;

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

export default ChooseGamePageContainer;
