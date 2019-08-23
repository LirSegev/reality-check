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
	moveToLocationOnMap: (long: number, lat: number, zoom?: number) => void;
	moveToMapTab: () => void;
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

	componentWillMount() {
		const db = firebase.firestore();
		const { gameId } = this.props;

		db.collection(`games/${gameId}/intel`)
			.orderBy('timestamp', 'desc')
			.onSnapshot(this._updateIntelItems, err =>
				console.error(new Error('Error getting intel snapshot:'), err)
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

	_handleClick(e: React.MouseEvent<HTMLElement, MouseEvent>) {
		const data = e.currentTarget.dataset;
		if (data.coords) {
			const coords = data.coords.split(',').map(num => Number(num));
			this.props.moveToLocationOnMap(coords[0], coords[1], 15);
		} else if (data.tram) this._showTransportOnMap('tram', data.tram);
		else if (data.metro) this._showTransportOnMap('metro', data.metro);
	}

	_showTransportOnMap(type: 'tram' | 'metro', line: number | string) {
		document.dispatchEvent(
			new CustomEvent('show-transport-on-map', {
				detail: {
					type,
					line,
				},
			})
		);
		this.props.moveToMapTab();
	}

	render = () => (
		<IntelTabView
			isAdmin={this.props.isAdmin}
			openAddItem={this._openAddItem}
			hideAddItem={this._hideAddItem}
			gameId={this.props.gameId}
			handleClick={this._handleClick}
			{...this.state}
		/>
	);
}

export default IntelTabContainer;
