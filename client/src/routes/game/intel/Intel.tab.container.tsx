import React from 'react';
import IntelTabView from './Intel.tab.view';
import { IntelItem } from './Intel.d';
import * as firebase from 'firebase/app';

interface State {
	intelItems: IntelItem[];
}
interface Props {
	gameId: string;
}

class IntelTabContainer extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			intelItems: [],
		};

		this._updateIntelItems = this._updateIntelItems.bind(this);
	}

	componentWillMount() {
		const db = firebase.firestore();
		const { gameId } = this.props;

		db.collection(`games/${gameId}/intel`).onSnapshot(this._updateIntelItems);
	}

	_updateIntelItems(intel: firebase.firestore.QuerySnapshot) {
		intel.docChanges().forEach(changes => {
			if (changes.type === 'added') {
				this.setState(prevState => ({
					intelItems: [
						...prevState.intelItems,
						changes.doc.data() as IntelItem,
					],
				}));
			}
		});
	}

	render = () => <IntelTabView intelItems={this.state.intelItems} />;
}

export default IntelTabContainer;
