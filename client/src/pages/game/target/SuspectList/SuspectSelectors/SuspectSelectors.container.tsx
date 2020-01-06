import React from 'react';

import { db } from '../../../../..';
import { getGameDocRef } from '../../../../../util/db';
import { putInArray, removeFromArray } from '../../../../../util/general';
import SuspectSelectorsView from './SuspectSelectors.view';

interface Props {
	showLegend: boolean;
	suspectId: number;
}
interface State {
	isMarked: boolean;
	isHidden: boolean;
}

class SuspectSelectorsContainer extends React.Component<Props, State> {
	state = {
		isMarked: false,
		isHidden: false,
	};

	componentDidMount() {
		this._getStateFromDb();
	}

	_getStateFromDb = async () => {
		const game = await getGameDocRef()
			.get()
			.then(doc => doc.data() as DB.GameDoc | undefined);
		if (game) {
			this.setState({
				isMarked:
					(game.marked_suspects?.indexOf(this.props.suspectId) ?? -1) >= 0,
				isHidden:
					(game.hidden_suspects?.indexOf(this.props.suspectId) ?? -1) >= 0,
			});
		}
	};

	_stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

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

	_updateDb(property: 'hidden' | 'marked', newValue: boolean) {
		db.runTransaction(async transaction => {
			const gameDoc = await transaction
				.get(getGameDocRef())
				.then(doc => doc.data() as DB.GameDoc | undefined);

			if (gameDoc) {
				let list =
					(property === 'marked'
						? gameDoc.marked_suspects
						: gameDoc.hidden_suspects) || [];

				list = newValue
					? putInArray(list, this.props.suspectId)
					: removeFromArray(list, this.props.suspectId);

				const updateData: Partial<DB.GameDoc> = {
					[`${property}_suspects`]: list,
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
			props,
			state,
		} = this;
		const { isMarked, isHidden } = state;
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
				}}
			/>
		);
	};
}

export default SuspectSelectorsContainer;
