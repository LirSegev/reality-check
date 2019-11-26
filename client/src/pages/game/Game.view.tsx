import * as React from 'react';
import { Page, Tabbar } from 'react-onsenui';
import { connect } from 'react-redux';

import Tab from '../../components/Tab.component';
import { ReduxState } from '../../reducers/initialState';
import IntelTabView from './intel';
import OperationTabView from './operation';
import TargetTab from './target';

interface Props {
	tabIndex: number;
	onMapMove: (map: mapboxgl.Map) => void;
	onTabChange: (e: any) => void;
	onOpTabChange: (e: any) => void;
	incrementUnreadNum: (type: UnreadType) => boolean;
	unreadNums: {
		chat: number;
		target: number;
		intel: number;
	};
}

const GameView: React.FC<Props> = props => (
	<Page>
		<Tabbar
			index={props.tabIndex}
			// @ts-ignore
			onPreChange={props.onTabChange}
			position="auto"
			renderTabs={() => [
				{
					content: (
						<TargetTab
							tabIndex={0}
							incrementUnreadNum={props.incrementUnreadNum}
							key="targetTab-content"
						/>
					),
					tab: (
						<Tab
							unreadNum={props.unreadNums.target}
							label="Target"
							key="targetTab-button"
						/>
					),
				},
				{
					content: (
						<IntelTabView
							incrementUnreadNum={props.incrementUnreadNum}
							key="intelTab-content"
						/>
					),
					tab: (
						<Tab
							unreadNum={props.unreadNums.intel}
							label="Intel"
							key="intelTab-button"
						/>
					),
				},
				{
					content: (
						<OperationTabView
							incrementUnreadNum={props.incrementUnreadNum}
							onTabChange={props.onOpTabChange}
							key="operationTab-content"
							onMapMove={props.onMapMove}
							unreadNumChat={props.unreadNums.chat}
						/>
					),
					tab: (
						<Tab
							unreadNum={
								props.tabIndex === 2 ? undefined : props.unreadNums.chat
							}
							label="Operation"
							key="operationTab-button"
						/>
					),
				},
			]}
		/>
	</Page>
);

const mapState = (state: ReduxState) => {
	const { main } = state;
	const { tabIndex } = main;
	return { tabIndex };
};
export default connect(mapState)(GameView);
