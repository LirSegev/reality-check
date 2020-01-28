import React from 'react';
import { Dialog, Icon, List } from 'react-onsenui';

import { store } from '../../../..';
import { AVAIL_SUSPECTS } from '../Target.tab.container';
import renderSuspectListItem from './renderSuspectListItem';
import styles from './SuspectList.module.css';

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
	<div id={styles.suspectListWrapper}>
		<div id={styles.openListIconWrapper} onClick={openList}>
			<Icon size={20} icon="fa-list-ul" />
		</div>
		<Dialog isOpen={isOpen} onCancel={closeList}>
			<List
				id={styles.suspectList}
				dataSource={
					store.getState().main.isAdmin ? AVAIL_SUSPECTS : suspectList
				}
				renderRow={renderSuspectListItem({ handleSuspectClick })}
			/>
		</Dialog>
	</div>
);

export default SuspectListView;
