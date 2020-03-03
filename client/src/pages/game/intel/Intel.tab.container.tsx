import * as firebase from 'firebase/app';
import React from 'react';
import { connect } from 'react-redux';

import {
	goToMapTab,
	moveToLocationOnMap,
} from '../../../reducers/main.reducer';
import { getGameDocRef } from '../../../util/db';
import IntelTabView from './Intel.tab.view';
import { IntelItem } from '../../../util/db.types';

interface State {
	intelItems: IntelItem[];
	isAddItemOpen: boolean;
}
interface Props {
	moveToLocationOnMap: ConnectedAction<typeof moveToLocationOnMap>;
	moveToMapTab: ConnectedAction<typeof goToMapTab>;
	incrementUnreadNum: (type: UnreadType) => boolean;
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
		this._handleClick = this._handleClick.bind(this);
	}

	componentDidMount() {
		getGameDocRef()
			.collection('intel')
			.orderBy('timestamp', 'desc')
			.onSnapshot(this._updateIntelItems, err =>
				console.error(new Error('Error getting intel snapshot:'), err)
			);
	}

	_openAddItem = () => {
		this.setState({
			isAddItemOpen: true,
		});
		document.dispatchEvent(new CustomEvent('onadditemopen'));
	};

	_hideAddItem = () =>
		this.setState({
			isAddItemOpen: false,
		});

	_updateIntelItems(intel: firebase.firestore.QuerySnapshot) {
		const newItems = [] as IntelItem[];
		intel.docChanges().forEach(changes => {
			if (changes.type === 'added') {
				newItems.push(changes.doc.data() as IntelItem);
				this.props.incrementUnreadNum('intel');
			}
		});

		this.setState(prevState => ({
			intelItems: [...newItems, ...prevState.intelItems],
		}));
	}

	_handleClick(e: React.MouseEvent<HTMLElement, MouseEvent>) {
		const data = e.currentTarget.dataset;
		if (data.coords) {
			const coords = data.coords.split(',').map(num => Number(num));
			this.props.moveToLocationOnMap({
				long: coords[0],
				lat: coords[1],
				zoom: 16,
			});
		}
	}

	render = () => (
		<IntelTabView
			openAddItem={this._openAddItem}
			hideAddItem={this._hideAddItem}
			handleClick={this._handleClick}
			{...this.state}
		/>
	);
}

const mapActions = {
	moveToMapTab: goToMapTab,
	moveToLocationOnMap,
};
export default connect(null, mapActions)(IntelTabContainer);
