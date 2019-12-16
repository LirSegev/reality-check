import React from 'react';
import { Icon, Dialog, List } from 'react-onsenui';
import renderSuspectListItem from './renderSuspectListItem';

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
				dataSource={suspectList}
				renderRow={renderSuspectListItem({ handleSuspectClick })}
			/>
		</Dialog>
	</React.Fragment>
);

export default SuspectListView;
