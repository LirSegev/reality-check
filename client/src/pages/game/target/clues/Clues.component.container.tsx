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

		this._updateClues = this._updateClues.bind(this);
	}

	componentDidMount() {
		getGameDocRef().onSnapshot(this._updateClues, err =>
			console.error(new Error('Getting game doc snapshot'), err)
		);
	}

	_updateClues(snapshot: firebase.firestore.DocumentSnapshot) {
		const data = snapshot.data();
		if (data && data['detective_clues']) {
			this.setState({ clues: data['detective_clues'] });
			this.props.incrementUnreadNum('target');
		}
	}

	render() {
		return <CluesView clues={this.state.clues} />;
	}
}

export default CluesContainer;
