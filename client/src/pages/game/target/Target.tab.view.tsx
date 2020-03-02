import * as React from 'react';
import { Page } from 'react-onsenui';

import Tabbar from '../../../components/Tabbar';
import { toTitleCase } from '../../../util/general';
import Clues from './clues';
import SuspectList from './SuspectList';
import Suspects from './suspects';
import SuspectStory from './SuspectStory';
import styles from './Target.module.css';
import { AVAIL_SUSPECTS } from './Target.tab.container';
import Notes from './Notes';

export interface Props {
	selectedSuspect: number | undefined;
	suspectList: number[];
	hiddenSuspects: number[];
	markedSuspects: number[];
	incrementUnreadNum: (type: UnreadType) => boolean;
	updateSuspectList: (suspectList: Props['suspectList']) => void;
	selectSuspect: (id: Props['selectedSuspect']) => void;
	onTabChange: (e: { index: number }) => void;
	isVisible: boolean;
}

const TargetTabView: React.FC<Props> = props => {
	const nameToInitials = (s: string) =>
		toTitleCase(s)
			.split(' ')
			.map((n, i, a) => (i < a.length - 1 ? n[0] + '.' : n)) //TODO: implicit any
			.join(' ');

	const suspectTabs = AVAIL_SUSPECTS.map(id => {
		const json = require(`../../../files/suspects/${id}.json`);

		const isInList = props.suspectList.indexOf(id) >= 0;
		const isHidden = props.hiddenSuspects.indexOf(id) >= 0;
		const isMarked = props.markedSuspects.indexOf(id) >= 0;
		const classes: string[] = [];
		if (isHidden || !isInList) classes.push(styles.hiddenTab);
		if (isMarked) classes.push(styles.markedTab);

		return {
			tabTitle: nameToInitials(json.name),
			content: <SuspectStory suspect={json} />,
			className: classes.join(' '),
		};
	});

	return (
		<Page>
			<div id={styles.targetTab}>
				<div id={styles.floatingIconsWrapper}>
					<Notes name={'main'} />
					<SuspectList
						suspectList={props.suspectList}
						selectSuspect={props.selectSuspect}
					/>
				</div>
				<Suspects
					isVisible={props.isVisible}
					selectSuspect={props.selectSuspect}
					selectedSuspect={props.selectedSuspect}
					suspectList={props.suspectList}
					updateSuspectList={props.updateSuspectList}
					hiddenSuspects={props.hiddenSuspects}
				/>
				<Tabbar
					tabs={[
						{
							tabTitle: 'Clues',
							content: <Clues incrementUnreadNum={props.incrementUnreadNum} />,
						},
						...suspectTabs,
					]}
					index={
						props.selectedSuspect
							? AVAIL_SUSPECTS.indexOf(props.selectedSuspect) + 1
							: undefined
					}
					onChange={props.onTabChange}
				/>
			</div>
		</Page>
	);
};

export default TargetTabView;
