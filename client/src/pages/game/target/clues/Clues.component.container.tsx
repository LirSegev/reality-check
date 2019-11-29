import * as firebase from 'firebase/app';
import React from 'react';

import { getGameDocRef } from '../../../../util/db';
import CluesView from './Clues.component.view';

interface State {
	clues: { [key: string]: string };
}
interface Props {
	incrementUnreadNum: (type: UnreadType) => boolean;
}

class CluesContainer extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			clues: {},
		};

		this._onSnapshot = this._onSnapshot.bind(this);
	}

	componentDidMount() {
		getGameDocRef().onSnapshot(this._onSnapshot, err =>
			console.error(new Error('Getting game doc snapshot'), err)
		);
	}

	_onSnapshot(snapshot: firebase.firestore.DocumentSnapshot) {
		const game = snapshot.data() as DB.GameDoc | undefined;
		if (
			game &&
			game.detective_clues &&
			JSON.stringify(game.detective_clues) !== JSON.stringify(this.state.clues)
		) {
			this._updateClues(game.detective_clues);
		}
	}

	_updateClues(clues: State['clues']) {
		this.setState({ clues });
		this.props.incrementUnreadNum('target');
	}

	render() {
		return <CluesView clues={this.state.clues} />;
	}
}

export default CluesContainer;
