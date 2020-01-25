import React from 'react';

import { db } from '../../../../..';
import { getGameDocRef } from '../../../../../util/db';
import { putInArray, removeFromArray } from '../../../../../util/general';
import SuspectSelectorsView from './SuspectSelectors.view';
import { store } from '../../../../../index';

interface Props {
	showLegend: boolean;
	suspectId: number;
}
interface State {
	isMarked: boolean;
	isHidden: boolean;
	isInList: boolean;
}

class SuspectSelectorsContainer extends React.Component<Props, State> {
	state = {
		isMarked: false,
		isHidden: false,
		isInList: false,
	};

	componentDidMount() {
		getGameDocRef().onSnapshot(snapshot => {
			const game = (snapshot.data() as DB.GameDoc) || undefined;
			this.setState({
				isMarked:
					(game.marked_suspects?.indexOf(this.props.suspectId) ?? -1) >= 0,
				isHidden:
					(game.hidden_suspects?.indexOf(this.props.suspectId) ?? -1) >= 0,
				isInList: (game.suspect_list?.indexOf(this.props.suspectId) ?? -1) >= 0,
			});
		});
	}

	_stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

	_handleIsInListChange = () => {
		this.setState(prevState => {
			const isInList = !prevState.isInList;

			this._updateDb('list', isInList);
			return { isInList };
		});
	};

	_handleMarkChange = () => {
		this.setState(prevState => {
			const isMarked = !prevState.isMarked;

			this._updateDb('marked', isMarked);
			return { isMarked };
		});
	};

	_handleHideChange = () => {
		this.setState(prevState => {
			const isHidden = !prevState.isHidden;

			this._updateDb('hidden', isHidden);
			return { isHidden };
		});
	};

	_updateDb(property: 'hidden' | 'marked' | 'list', newValue: boolean) {
		db.runTransaction(async transaction => {
			const gameDoc = await transaction
				.get(getGameDocRef())
				.then(doc => doc.data() as DB.GameDoc | undefined);

			if (gameDoc) {
				let list = [];
				let key = '';
				switch (property) {
					case 'marked':
						list = gameDoc.marked_suspects || [];
						key = 'marked_suspects';
						break;
					case 'hidden':
						list = gameDoc.hidden_suspects || [];
						key = 'hidden_suspects';
						break;
					case 'list':
						key = 'suspect_list';
						list = gameDoc.suspect_list || [];
				}

				list = newValue
					? putInArray(list, this.props.suspectId)
					: removeFromArray(list, this.props.suspectId);

				const updateData: Partial<DB.GameDoc> = {
					[key]: list,
				};
				return transaction.update(getGameDocRef(), updateData);
			}
		});
	}

	render = () => {
		const {
			_stopPropagation: stopPropagation,
			_handleMarkChange: handleMarkChange,
			_handleHideChange: handleHideChange,
			_handleIsInListChange: handleInListChange,
			props,
			state,
		} = this;
		const { isMarked, isHidden, isInList } = state;
		const { showLegend } = props;
		return (
			<SuspectSelectorsView
				{...{
					stopPropagation,
					showLegend,
					handleMarkChange,
					isMarked,
					isHidden,
					handleHideChange,
					isInList,
					handleInListChange,
					isAdmin: store.getState().main.isAdmin,
				}}
			/>
		);
	};
}

export default SuspectSelectorsContainer;
