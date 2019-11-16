import * as React from 'react';
import { Page, Tabbar } from 'react-onsenui';
import Tab from '../../components/Tab.component';
import TargetTabView from './target';
import OperationTabView from './operation';
import IntelTabView from './intel';
import { ReduxState } from '../../reducers/initialState';
import { connect } from 'react-redux';

interface Props {
	tabIndex: number;
	onMapMove: (map: mapboxgl.Map) => void;
	onTabChange: (e: unknown) => void;
	onOpTabChange: (e: unknown) => void;
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
						<TargetTabView
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
