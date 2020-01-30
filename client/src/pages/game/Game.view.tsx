import * as React from 'react';
import { Page, Tabbar } from 'react-onsenui';
import { connect } from 'react-redux';

import Tab from '../../components/Tab.component';
import { ReduxState } from '../../reducers/initialState';
import IntelTabView from './intel';
import ChatTab from './operation/chat';
import MapTab from './operation/map';
import TargetTab from './target';

interface Props {
	tabIndex: number;
	onMapMove: (map: mapboxgl.Map) => void;
	onTabChange: (e: unknown) => void;
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
			swipeable={true}
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
							label="Suspects"
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
							label="Timeline"
							key="intelTab-button"
						/>
					),
				},
				{
					content: <MapTab key="mapTab-content" onMove={props.onMapMove} />,
					tab: <Tab label="Map" key="mapTab-button" />,
				},
				{
					content: (
						<ChatTab
							incrementUnreadNum={props.incrementUnreadNum}
							key="chatTab-content"
						/>
					),
					tab: (
						<Tab
							label="Chat"
							unreadNum={props.unreadNums.chat}
							key="chatTab-button"
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
