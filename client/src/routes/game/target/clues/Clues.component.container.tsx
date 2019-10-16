import React from 'react';
import * as firebase from 'firebase/app';
import CluesView from './Clues.component.view';

interface State {
	clues: { [key: string]: string };
}
interface Props {
	gameId: string;
	incrementUnreadNum: (type: UnreadType) => boolean;
}

class CluesContainer extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			clues: {},
		};

		this._updateClues = this._updateClues.bind(this);
	}

	componentDidMount() {
		const db = firebase.firestore();
		db.doc(`games/${this.props.gameId}`).onSnapshot(this._updateClues, err =>
			console.error(new Error('Getting game doc snapshot'), err)
		);
	}

	_updateClues(snapshot: firebase.firestore.DocumentSnapshot) {
		const data = snapshot.data();
		if (data && data['identity_clues']) {
			this.setState({ clues: data['identity_clues'] });
			this.props.incrementUnreadNum('target');
		}
	}

	render() {
		return <CluesView clues={this.state.clues} />;
	}
}

export default CluesContainer;
