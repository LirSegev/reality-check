import ons from 'onsenui';
import * as React from 'react';
import { connect } from 'react-redux';

import { db } from '../..';
import { ReduxState } from '../../reducers/initialState';
import {
	changeGame,
	stopLoading,
	addNotification,
} from '../../reducers/main.reducer';
import ChooseGamePageView from './ChooseGame.page.view';
import renderGameItem from './renderGameItem';

interface Props {
	stopLoading: ConnectedAction<typeof stopLoading>;
	changeGame: ConnectedAction<typeof changeGame>;
	addNotification: ConnectedAction<typeof addNotification>;
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
		this._getGameList();
	}

	_getGameList() {
		db.collection('games')
			.get()
			.then(games => {
				let gameList: string[] = [];
				games.forEach(game => {
					gameList.push(game.id);
				});
				this.setState({
					gameList,
				});
				this.props.stopLoading();
			})
			.catch(err => console.error(new Error('Error getting game list:'), err));
	}

	_createGame = () => {
		ons.notification
			.prompt({
				message: 'Enter code for game',
				// @ts-ignore
				placeholder: 'Game code',
				title: 'Create game',
			})
			.then((name: string) => {
				return db
					.collection('games')
					.doc(encodeURIComponent(name))
					.set({ phase: 1 })
					.then(() => {
						this._getGameList();
						this.props.addNotification({
							notification: {
								type: 'success',
								header: 'Created new game',
							},
						});
					});
			})
			.catch((err: any) => {
				console.log('err: ', err);
				this.props.addNotification({
					notification: {
						type: 'error',
						header: 'There was an error creating a new game',
					},
				});
			});
	};

	render = () => (
		<ChooseGamePageView
			createGame={this._createGame}
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
	addNotification,
};
export default connect(mapState, mapDispatch)(ChooseGamePageContainer);
