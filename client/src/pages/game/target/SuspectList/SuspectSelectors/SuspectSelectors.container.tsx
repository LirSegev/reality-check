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
}

class SuspectSelectorsContainer extends React.Component<Props, State> {
	state = {
		isMarked: false,
	};

	_stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

	_handleMarkChange = () => {
		this.setState(prevState => {
			const isMarked = !prevState.isMarked;

			this._updateMarkDB(isMarked);
			return { isMarked };
		});
	};

	_updateMarkDB(marked: boolean) {
		db.runTransaction(async transaction => {
			const gameDoc = await transaction
				.get(getGameDocRef())
				.then(doc => doc.data() as DB.GameDoc | undefined);

			if (gameDoc) {
				let markedSuspects = gameDoc.marked_suspects || [];
				markedSuspects = marked
					? putInArray(markedSuspects, this.props.suspectId)
					: removeFromArray(markedSuspects, this.props.suspectId);

				const updateData: Partial<DB.GameDoc> = {
					marked_suspects: markedSuspects,
				};
				return transaction.update(getGameDocRef(), updateData);
			}
		});
	}

	render = () => {
		const {
			_stopPropagation: stopPropagation,
			_handleMarkChange: handleMarkChange,
			props,
			state,
		} = this;
		const { isMarked } = state;
		const { showLegend } = props;
		return (
			<SuspectSelectorsView
				{...{ stopPropagation, showLegend, handleMarkChange, isMarked }}
			/>
		);
	};
}

export default SuspectSelectorsContainer;
