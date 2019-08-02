import * as React from 'react';
import ChooseGamePageView from './ChooseGame.page.view';
import * as firebase from 'firebase/app';

interface Props {
	stopLoading: () => void;
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
			.catch(err => console.error(err));
	}

	render = () => <ChooseGamePageView gameList={this.state.gameList} />;
}

export default ChooseGamePageContainer;
