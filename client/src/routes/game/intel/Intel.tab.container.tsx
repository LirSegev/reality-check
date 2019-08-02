import React from 'react';
import IntelTabView from './Intel.tab.view';
import { IntelItem } from './Intel.d';
import * as firebase from 'firebase/app';

interface State {
	intelItems: IntelItem[];
	isAddItemOpen: boolean;
}
interface Props {
	gameId: string;
	isAdmin: boolean;
}

class IntelTabContainer extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			intelItems: [],
			isAddItemOpen: false,
		};

		this._updateIntelItems = this._updateIntelItems.bind(this);
		this._openAddItem = this._openAddItem.bind(this);
		this._hideAddItem = this._hideAddItem.bind(this);
	}

	componentWillMount() {
		const db = firebase.firestore();
		const { gameId } = this.props;

		db.collection(`games/${gameId}/intel`).onSnapshot(
			this._updateIntelItems,
			err => console.error(err)
		);
	}

	_openAddItem = () =>
		this.setState({
			isAddItemOpen: true,
		});

	_hideAddItem = () =>
		this.setState({
			isAddItemOpen: false,
		});

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

	render = () => (
		<IntelTabView
			isAdmin={this.props.isAdmin}
			openAddItem={this._openAddItem}
			hideAddItem={this._hideAddItem}
			{...this.state}
		/>
	);
}

export default IntelTabContainer;
