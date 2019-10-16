import * as React from 'react';
import { Page, Tabbar } from 'react-onsenui';
import Tab from '../../components/Tab.component';
import TargetTabView from './target';
import OperationTabView from './operation';
import IntelTabView from './intel';

interface Props {
	gameId: string;
	isAdmin: boolean;
	mapOrientation: MapOrientation;
	tabIndex: number;
	onMapMove: (map: mapboxgl.Map) => void;
	onTabChange: (e: any) => void;
	moveToLocationOnMap: (long: number, lat: number, zoom?: number) => void;
	moveToMapTab: () => void;
	onOpTabChange: (e: any) => void;
	opTabIndex: number;
	incrementUnreadNum: (type: UnreadType) => void;
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
						<TargetTabView gameId={props.gameId} key="targetTab-content" />
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
							moveToLocationOnMap={props.moveToLocationOnMap}
							moveToMapTab={props.moveToMapTab}
							isAdmin={props.isAdmin}
							gameId={props.gameId}
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
							tabIndex={props.opTabIndex}
							gameId={props.gameId}
							key="operationTab-content"
							mapOrientation={props.mapOrientation}
							onMapMove={props.onMapMove}
							unreadNumChat={props.unreadNums.chat}
						/>
					),
					tab: <Tab label="Operation" key="operationTab-button" />,
				},
			]}
		/>
	</Page>
);

export default GameView;
