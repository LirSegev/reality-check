import React from 'react';
import { Icon, Dialog, List } from 'react-onsenui';
import renderSuspectListItem from './renderSuspectListItem';
import { store } from '../../../../index';

/**
 * List of usable suspects
 */
const AVAIL_SUSPECTS: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

interface Props {
	suspectList: number[];
	isOpen: boolean;
	closeList: () => void;
	openList: () => void;
	handleSuspectClick: (e: React.MouseEvent<any, MouseEvent>) => void;
}

const SuspectListView: React.FC<Props> = ({
	suspectList,
	isOpen,
	closeList,
	openList,
	handleSuspectClick,
}) => (
	<React.Fragment>
		<div onClick={openList}>
			<Icon size={20} icon="fa-filter" />
		</div>
		<Dialog isOpen={isOpen} onCancel={closeList}>
			<List
				dataSource={
					store.getState().main.isAdmin ? AVAIL_SUSPECTS : suspectList
				}
				renderRow={renderSuspectListItem({ handleSuspectClick })}
			/>
		</Dialog>
	</React.Fragment>
);

export default SuspectListView;
