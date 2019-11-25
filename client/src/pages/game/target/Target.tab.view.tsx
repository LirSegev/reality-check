import * as React from 'react';
import { Page } from 'react-onsenui';

import Tabbar from '../../../components/Tabbar';
import Clues from './clues';
import Suspects from './suspects';
import SuspectStory from './SuspectStory';

export interface Props {
	selectedSuspect: number | null;
	suspectList: number[];
	incrementUnreadNum: (type: UnreadType) => boolean;
	updateSuspectList: (suspectList: Props['suspectList']) => void;
	selectSuspect: (id: Props['selectedSuspect']) => void;
}

const TargetTabView: React.FC<Props> = props => {
	const suspectTabs = props.suspectList.map(id => {
		const json = require(`../../../files/suspects/${id}.json`);
		return {
			tabTitle: json.name,
			content: <SuspectStory suspect={json} />,
		};
	});

	return (
		<Page>
			<div style={{ height: '100%' }}>
				<Suspects
					selectedSuspect={props.selectedSuspect}
					suspectList={props.suspectList}
					updateSuspectList={props.updateSuspectList}
				/>
				<Tabbar
					tabs={[
						{
							tabTitle: 'Clues',
							content: <Clues incrementUnreadNum={props.incrementUnreadNum} />,
						},
						...suspectTabs,
					]}
				/>
			</div>
		</Page>
	);
};

export default TargetTabView;
